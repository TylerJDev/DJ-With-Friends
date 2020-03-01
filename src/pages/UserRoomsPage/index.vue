<template>
  <div id="room_container">
    <a href="/" id="leave_room" style="display: none;">Leave Room</a>
    <Navbar @change-device="changeMainDevice" />
    <Player @add-track="handleTrackAddition" :currentTrackPlaying="currentTrackPlaying" @skip-track="skipTrack" :currentTrackData="currentTrackData" @handle-modal="handleModal"/>
    <UserList :currentUsers="currentUsers" style="display: none;"/>
    <TrackListModal @add-queue="addToQueueSocket" :visible="visibleModal" @handle-modal="handleModal" @refresh-token="refreshToken"/>
    <TrackSlider />
  </div>
</template>

<script>
// @ is an alias to /src
import Player from '@/pages/UserRoomsPage/RoomPlayer.vue';
import UserList from '@/pages/UserRoomsPage/UserList.vue';
import io from 'socket.io-client';
import TrackListModal from '@/pages/UserRoomsPage/TrackListModal.vue';
import Navbar from '@/pages/UserRoomsPage/RoomNavbar.vue';
import TrackSlider from '@/pages/UserRoomsPage/TrackSlider.vue'

export default {
  name: 'room',
  data() {
    return {
      currentTrackData: [{'user': 'Tyler', 'name': 'Drive In', 'artist': 'MED, Blu, Madlib, Aloe Blacc', 'duration': '3:59'}],
      currentUsers: [],
      currentTrackPlaying: {'track': '', 'playing': false, 'artist': ''},
      socketConnect: io.connect(`http://localhost:3000/${this.$route.params.id}`),
      visibleModal: false
    }
  },
  methods: {
    handleTrackAddition(value) {
      this.currentTrackData.push(value);
    },
    addToQueueSocket(data) {
      this.socketConnect.emit('addQueue', data);
      this.socketConnect.on('removeFromQueue', () => {
        this.currentTrackData.shift();
      })
    },
    skipTrack() {
      this.socketConnect.emit('skipTrack', this.$store.state.spotifyAPIData);
      this.socketConnect.on('trackSkipped', (data) => {
        // If an error occurred while skipping track
        if (data.hasOwnProperty('error')) {          
          this.$store.dispatch('handleNotification', {'type': 'error', 'initialised': true, 'title': 'Couldn\'t skip track', 'subtitle': data.error});
          return false;
        }
        
        this.$store.dispatch('handleNotification', {'type': 'success', 'initialised': true, 'title': 'Track Skipped', 'subtitle': data.message});
        this.$store.commit('notifyUsers', {'type': 'success', 'initialised': true, 'message': 'Track Skipped', 'name': this.$store.state.rooms.currentTrack.track, 'timeJoined': data.timeAgo});
        this.$store.commit('setProgression', {'increment': false});
      });
    },
    handleModal(value) {
      if (typeof value === 'boolean')
        this.visibleModal = value;
    },
    changeMainDevice(data) {
      if (data.hasOwnProperty('id') && typeof data.id === 'string') {
        this.socketConnect.emit('changeSetting', {'type': 'devices', 'mainDevice': data.id});
        localStorage.setItem('main_device', data.id);

        this.$store.dispatch('handleNotification', {'type': 'success', 'initialised': true, 'title': 'Device has changed', 'subtitle': 'The main device has changed! Playback from that device will start when the next track is played.'});

      }
    },
    refreshToken(oldAccessToken) {
      this.socketConnect.emit('refreshAccessToken', {'oldAccessToken': oldAccessToken, 'id': this.$store.state.spotifyAPIData.userID});
    }
  },
  created() {
    // Send user details to the socket
    this.socketConnect.emit('userDetails', {'display_name': this.$store.state.spotifyAPIData.user, 'id': this.$store.state.spotifyAPIData.userID, 'access_token': this.$store.state.spotifyAPIData.accessToken, 'devices': this.$store.state.spotifyAPIData.devices, 'mainDevice': this.$store.state.spotifyAPIData.mainDevice});
    this.socketConnect.on('currentTrack', (data) => {
      if (data.track.length) {
        // Get current progress from server
        this.$store.dispatch('handleProgression', {'maxTime': data.duration});
        this.$store.commit('setCurrentProgress', {'seconds': Math.floor((Date.now() - data.timeStarted) / 1000)});
      } else {
        this.$store.commit('setProgression', {'increment': false});
      }

      this.currentTrackPlaying = data;
      this.$store.commit('addCurrentTrack', data);
    });

    this.socketConnect.on('addedQueue', (data) => {
      this.currentTrackData = data;

      this.$store.commit('addToQueue', data);

      this.socketConnect.on('timeUpdate', (data) => {
        this.$store.commit('setCurrentProgress', data.seconds);
      });
    });

    this.socketConnect.on('votedSkip', (data) => {
      if (data.currentVotes.length) {
        this.$store.commit('addSkipVotes', data);
      }
    });

    this.socketConnect.on('user', (data) => {
      const ROOM_USERS = data.users.map(curr => curr.name);
      this.$store.commit('notifyUsers', data.messageData);
      this.$store.state.rooms.users = ROOM_USERS;
    });

    this.socketConnect.on('roomError', (roomError) => {
      this.$store.dispatch('handleNotification', {'type': 'error', 'initialised': true, 'title': roomError.typeError, 'subtitle': roomError.errorMessage});
    });
  },
  components: {
    Player,
    UserList,
    TrackListModal,
    Navbar,
    TrackSlider
  }
}
</script>

<style lang="scss">
  #room_container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>