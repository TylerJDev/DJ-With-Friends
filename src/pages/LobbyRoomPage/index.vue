<template>
  <div class="home">
    <header>
      <h1>Join a room with friends, <br>or strangers.</h1>
      <h2 id="swf">Spotify<br>With<br>Friends.</h2>
    </header>
    <RoomList v-bind:genres="currentGenres"/>
    <RoomCreationModal @createRoom="createRoom"/>
  </div>
</template>

<script>
import io from 'socket.io-client';
import RoomCreationModal from '@/pages/LobbyRoomPage/RoomCreationModal.vue';
import RoomList from '@/pages/LobbyRoomPage/RoomList.vue';
import MockRoom from '@/utils/mocks/RoomList.js';

export default {
  name: 'home',
  data() {
    return {
      socketConnect: io.connect('http://localhost:3000/rooms'),
      currentLocation: window.location.href, /* DEV VALUE */
      activeModal: false,
      currentGenres: this.$store.getters.grabGenre('')
    }
  },
  methods: {
    createRoom: function (roomData) {
      this.socketConnect.emit('createRoom', {'id': this.$store.state.spotifyAPIData.userID, 'display_name': this.$store.state.spotifyAPIData.user, 'settings': roomData, 'token': this.$store.state.spotifyAPIData.refreshToken});

      this.socketConnect.on('roomError', (roomError) => {
        this.$store.dispatch('handleNotification', {'type': 'error', 'initialised': true, 'title': roomError.typeError, 'subtitle': roomError.errorMessage});
      });

      this.socketConnect.on('serverCreated', (roomData) => {
        this.$store.state.lobby.rooms = roomData['roomData'];

        // this.$store.state.randID = roomData['roomID']; What is this for?
        this.$router.push(`room/${roomData['roomID']}`);
      });
    }, modalActivate: function() {
      this.activeModal = true;
    }
  },
  mounted() {
    const privateSocket = io.connect('http://localhost:3000');
    /* Add mock data for rooms 
    let mockData = [new MockRoom({'roomGenre': 'Hip Hop', 'roomPrivate': true}), new MockRoom({'roomGenre': 'All'}), new MockRoom({'roomGenre': 'Rap'}), new MockRoom({'roomGenre': 'Jazz'}),
    new MockRoom({'roomGenre': 'Popular music'}), new MockRoom({'roomGenre': 'Soul music'}), new MockRoom({'roomGenre': 'Grunge'}), new MockRoom({'roomGenre': 'World music'}),
    new MockRoom({'roomGenre': 'Breakbeat'}), new MockRoom({'roomGenre': 'Classical music'}), new MockRoom({'roomGenre': 'Raggae'}), new MockRoom({'roomGenre': 'Disco'}), new MockRoom({'roomGenre': 'New wave'}),
    new MockRoom({'roomGenre': 'New wave'}), new MockRoom({'roomGenre': 'New wave'}), new MockRoom({'roomGenre': 'New wave'}), new MockRoom({'roomGenre': 'New wave'}), new MockRoom({'roomGenre': 'New wave'})]
    this.$store.state.lobby.rooms.push(...mockData);
    */

    this.socketConnect.emit('create_user', {'display_name': this.$store.state.spotifyAPIData.user, 'id': this.$store.state.spotifyAPIData.userID});
    this.socketConnect.on('servers', (data) => { this.$store.commit('addToRooms', data); });

    privateSocket.on('rooms', (data) => {
      this.$store.commit('addToRooms', data);
      this.$store.state.lobby.rooms.forEach(function(curr, index) {
        // Find the room "name" from data
        let currentData = data.filter(current => current.name === curr.name)[0];
        if (currentData !== undefined)
          this.$store.state.lobby.rooms[index].users = currentData.users;
      }, this);

    });
  },
  components: {
    RoomCreationModal,
    RoomList
  }
}
</script>


<style lang="scss" scoped>
  .home header {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
    padding-top: 3rem;
    #swf {
      font-size: 3.3rem;
      font-weight: bold;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    text-align: initial;
    font-family: 'Roboto Condensed', sans-serif;
    color: black;
  }

</style>