<template>
  <div class="home">
    <h1>Find a room!</h1>
    <h2>There are {{rooms.length}} rooms!</h2>
    <!-- <button @click="createRoom()">Create a room</button> -->
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#room_create_modal">Create Room</button>
    <div id="current_rooms" class="container-fluid">
      <ul>
        <li v-for="(current, index) in rooms" v-bind:key="index">
          <div>
            <a v-bind:href="currentLocation + 'room/' + rooms[index].name">{{rooms[index].settings['room-name']}}</a>
            <span class="room_user_count">Users: {{rooms[index].users.length}}</span>
            <span class="room_genre">{{rooms[index].settings['room-genre']}}</span>
          </div>
        </li>
      </ul>
    </div>
    <RoomCreationModal @createRoom="createRoom"/>
  </div>
</template>

<script>
import io from 'socket.io-client'
import RoomCreationModal from '../components/RoomCreationModal.vue'

export default {
  name: 'home',
  data() {
    return {
      rooms: [],
      socketConnect: io.connect('http://localhost:3000/rooms'),
      currentLocation: window.location.href /* DEV VALUE */
    }
  },
  methods: {
    createRoom: function (roomData) {
      this.socketConnect.emit('createRoom', {'id': this.$store.state.spotifyAPIData.userID, 'display_name': this.$store.state.spotifyAPIData.user, 'settings': roomData});

      this.socketConnect.on('roomError', (roomError) => {
        console.log(roomError);
      });

      this.socketConnect.on('serverCreated', (roomData) => {
        this.rooms = roomData['roomData'];
        console.log(this.rooms);

        console.log('Directing to: ' + roomData['roomID']);
        this.$store.state.randID = roomData['roomID'];
        this.$router.push(`room/${roomData['roomID']}`);
      });
    }
  },
  mounted() {
    this.socketConnect.emit('create_user', {'display_name': this.$store.state.spotifyAPIData.user, 'id': this.$store.state.spotifyAPIData.userID});
    this.socketConnect.on('servers', (roomData) => {this.rooms = roomData;});
    this.socketConnect.on('updateLobby', (data) => {
      // 1. Add to "rooms" array
      this.rooms.forEach(function(curr, index) {
        // Find the room "name" from data
        let currentData = data.filter(current => current.name === curr.name)[0];
        
        if (currentData !== undefined)
          this.rooms[index].users = currentData.users;
      }, this);

    });
  },
  components: {
    RoomCreationModal
  }
}
</script>
