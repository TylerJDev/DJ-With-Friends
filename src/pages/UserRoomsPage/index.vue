<template>
  <div class="room">
    <a href="/" id="leave_room" style="display: none;">Leave Room</a>
    <Navbar />
    <Player @add-track="handleTrackAddition" v-bind:currentTrackPlaying="currentTrackPlaying" @skip-track="skipTrack" v-bind:currentTrackData="currentTrackData"/>
    <UserList v-bind:currentUsers="currentUsers" style="display: none;"/>
    <TrackListModal @add-queue="addToQueueSocket" />
  </div>
</template>

<script>
// @ is an alias to /src
import Player from '@/pages/UserRoomsPage/RoomPlayer.vue';
import UserList from '@/pages/UserRoomsPage/UserList.vue';
import io from 'socket.io-client';
import userListStore from '@/store/modules/rooms.js';
import TrackListModal from '@/pages/UserRoomsPage/TrackListModal.vue';
import Navbar from '@/pages/UserRoomsPage/RoomNavbar.vue';

export default {
  name: 'room',
  data() {
    return {
      currentTrackData: [{'user': 'Tyler', 'name': 'Drive In', 'artist': 'MED, Blu, Madlib, Aloe Blacc', 'duration': '3:59'}],
      currentUsers: [],
      currentTrackPlaying: {'track': '', 'playing': false, 'artist': ''},
      socketConnect: io.connect(`http://localhost:3000/${this.$route.params.id}`)
    }
  },
  methods: {
    handleTrackAddition(value) {
      this.currentTrackData.push(value);
    },
    addToQueueSocket(data) {
      this.socketConnect.emit('addQueue', data);

      this.socketConnect.on('addedQueue', (data) => {
        this.currentTrackData = data;
      });

      this.socketConnect.on('removeFromQueue', (data) => {
        this.currentTrackData.shift();
      })
    },
    skipTrack() {
      this.socketConnect.emit('skipTrack', this.$store.state.spotifyAPIData);
      this.socketConnect.on('trackSkipped', (data) => {
        // If an error occurred while skipping track
        if (data.hasOwnProperty('error')) {
          alert(data.error); //# DEV-NOTE Find a better way to represent this error
        }
      });
    }
  },
  created() {
    // Send user details to the socket
    this.socketConnect.emit('userDetails', {'display_name': this.$store.state.spotifyAPIData.user, 'id': this.$store.state.spotifyAPIData.userID, 'access_token': this.$store.state.spotifyAPIData.accessToken, 'devices': this.$store.state.spotifyAPIData.devices});
    this.socketConnect.on('currentTrack', (data) => {
      this.currentTrackPlaying = data;
    });

    this.socketConnect.on('user', (data) => {
      // Handle user connected

      // 1. Grab all users within socket room
      const ROOM_USERS = data.map(curr => curr.id);
    
      // 2. "Push" to store
      userListStore.state.users = ROOM_USERS;
    });
  },
  components: {
    Player,
    UserList,
    TrackListModal,
    Navbar
  }
}
</script>
