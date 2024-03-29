<template>
  <div id="room_container">
    <a href="/" id="leave_room" style="display: none;">Leave Room</a>
    <Navbar @change-device="changeMainDevice" />
    <Player @add-track="handleTrackAddition" :currentTrackPlaying="currentTrackPlaying" @skip-track="skipTrack" :currentTrackData="currentTrackData" @handle-modal="handleModal" @handle-host="handleHost"/>
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
import Navbar from '@/components/Navbar.vue';
import TrackSlider from '@/pages/UserRoomsPage/TrackSlider.vue'

export default {
  name: 'room',
  data() {
    return {
      currentTrackData: [{'user': 'Tyler', 'name': 'Drive In', 'artist': 'MED, Blu, Madlib, Aloe Blacc', 'duration': '3:59'}],
      currentUsers: [],
      currentTrackPlaying: {'track': '', 'playing': false, 'artist': ''},
      socketConnect: io.connect(`${this.$store.state.location}${this.$route.params.id}${this.$store.state.roomKey}`),
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
        this.$store.dispatch('changeMainDevice', data);
      }
    },
    refreshToken(oldAccessToken) {
      this.socketConnect.emit('refreshAccessToken', {'oldAccessToken': oldAccessToken, 'id': this.$store.state.spotifyAPIData.userID, 'newAccessToken': this.$store.state.spotifyAPIData.accessToken});
    },
    handleHost(value) {
      this.socketConnect.emit('userHosts', {'host': value});
    }
  },
  created() {
    // Send user details to the socket
    // this.socketConnect.emit('userDetails', {'display_name': this.$store.state.spotifyAPIData.user, 'id': this.$store.state.spotifyAPIData.userID, 'access_token': this.$store.state.spotifyAPIData.accessToken, 'devices': this.$store.state.spotifyAPIData.devices, 'mainDevice': this.$store.state.spotifyAPIData.mainDevice, 'premium': this.$store.state.spotifyAPIData.premium, 'hostMode': this.$store.state.hostMode, 'images': this.$store.state.spotifyAPIData.images !== false ? this.$store.state.spotifyAPIData.images : {}});
    this.socketConnect.emit('userDetails', {
      userID: this.$store.state.spotifyAPIData.userID, 
      uid: this.$store.state.spotifyAPIData.uid, 
      mainDevice: this.$store.state.spotifyAPIData.mainDevice, 
      hostMode: this.$store.state.hostMode, 
      images: this.$store.state.spotifyAPIData.images !== false ? this.$store.state.spotifyAPIData.images : {},
      roomID: this.$store.state.roomID,
    });

    this.socketConnect.on('currentTrack', (data) => {
      if ((data.userID && this.$store.state.spotifyAPIData.userID === data.userID) 
      || !data.userID) {

        if (data.userID) {
          delete data.userID;
        }

        if (data.track.length) {
          this.$store.dispatch('handleProgression', {'maxTime': data.duration});
          this.$store.commit('setCurrentProgress', {'seconds': Math.floor((Date.now() - data.timeStarted) / 1000)});
        } else {
          this.$store.commit('setProgression', {'increment': false});
        }
        this.currentTrackPlaying = data;
        this.$store.commit('addCurrentTrack', data);
      }
    });

    this.socketConnect.on('addedQueue', (queueData) => {
      if ((queueData.userID && this.$store.state.spotifyAPIData.userID === queueData.userID) 
      || !queueData.userID) {
        if (queueData.userID) {
          delete queueData.userID;
        }

        this.currentTrackData = JSON.parse(JSON.stringify(queueData));

        this.currentTrackData.queueData.forEach((current, index) => {
          let prefix = Object.prototype.hasOwnProperty.call(current, 'track') === true ? current.track.substring(0, 3) : '___';
          current.keyID = String(Math.floor(Math.random() * (10000 * 1000))) + '-' + prefix;
        });

        this.$store.commit('addToQueue', JSON.parse(JSON.stringify(queueData)));

        this.socketConnect.on('timeUpdate', (data) => {
          this.$store.commit('setCurrentProgress', data);
        });
      }
    });

    this.socketConnect.on('votedSkip', (data) => {
      this.$store.commit('addSkipVotes', data);
    });

    this.socketConnect.on('user', (data) => {
      /* data.users.push({accessToken: "", host: true, id: "5xm4va5mohag68yw3xfu9yt64", mainDevice: null, name: "Bloo", premium: "true", roomID: 3707, timeJoined: 1585352845629, userCount: 1})
      data.users.push({accessToken: "", host: true, id: "5xm4va5mohag68yw3xfu9yt64", mainDevice: null, name: "Bloo", premium: "true", roomID: 3707, timeJoined: 1585352845629, userCount: 1}) */

      let usersActive = [];

      const ROOM_USERS = data.users.map((curr) => {
        let prefix = '';
        if (usersActive.indexOf(curr.name) >= 0) {
          prefix = ` (${usersActive.filter(c => c === curr.name).length})`;
        }

        usersActive.push(curr.name)
        return curr.name + prefix;
      });

      this.$store.commit('notifyUsers', data.messageData);
      this.$store.state.rooms.users = ROOM_USERS;

      // Set host
      const hostCurrent = data.users.filter(currentUser => currentUser.host === true);

      if (hostCurrent.length && this.$store.state.spotifyAPIData.userID === hostCurrent[0].id && !this.$store.state.rooms.hosting) {
        this.$store.state.rooms.hosting = true;
      }
    });

    this.socketConnect.on('roomError', (roomError) => {
      this.$store.dispatch('handleNotification', {'type': 'error', 'initialised': true, 'title': roomError.typeError, 'subtitle': roomError.errorMessage});
    });

    this.socketConnect.on('reAuth', (data) => {
      if (data.user === this.$store.state.spotifyAPIData.userID) {
        const oldAccess = this.$store.state.spotifyAPIData.accessToken;
        this.$store.commit('loadingState', {'status': true});
        this.$store.dispatch('handleReAuth', {refreshFromRooms: true, forceAuth: true}).then(() => {
          this.refreshToken(oldAccess);
            if (this.$store.state.spotifyAPIData.accessToken === oldAccess) {
              Store.dispatch('handleNotification', {
                timeout: 10000, type: 'error', initialised: true, title: 'Request failed', subtitle: 'Could not request new access token!',
              });
              this.$store.commit('loadingState', {'status': false});
            } else {
              this.$store.commit('loadingState', {'status': false});
            }
        });


      }
    });
  },
  mounted() {
    this.$store.state.loading = false;
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
  @media (max-width: $breakpoint--03) {
    #room_container {
      height: auto !important;
    }

    #trackslider_container {
      margin-top: 15% !important;
      display: none;
    }
  }

  #room_container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>