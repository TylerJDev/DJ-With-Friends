<template>
  <div class="home">
    <Navbar @change-device="changeMainDevice" />
    <h1 id="main_heading">DJ WITH FRIENDS</h1>
    <div id="main_container" class="container-fluid">
      <div id="left_panel" class="col-md panel-main">
        <div class="panel_container">
          <h2>Rooms</h2>
          <button type="button" id="modal_create_room" class="cv-button bx--btn bx--btn--tertiary" v-on:click="activeModal = true">Create Room</button>
        </div>
        <div class="sort">
          <RoomSelect @show-details="showDetails"/>     
        </div>
      </div>
      <div id="mid_panel" class="col-md panel-main">
        <RoomVinyl />
      </div>
      <transition name="slide-in">
        <h2 id="details_heading" v-if="detailsActive">DETAILS</h2>
      </transition>
      <div id="right_panel" class="col-md panel-main">
        <RoomBio @hide-details="hideDetails"/>
      </div>
    </div>

    <RoomCreationModal @createRoom="createRoom" :modalActive="activeModal" @closeModal="closeModal"/>
    <LobbyFooter />
  </div>
</template>

<script>
import io from 'socket.io-client';
import RoomCreationModal from '@/pages/LobbyRoomPage/RoomCreationModal.vue';
import RoomSelect from '@/pages/LobbyRoomPage/RoomSelect.vue';
import {mockData} from '@/utils/mocks/RoomList.js';
import Navbar from '@/components/Navbar.vue';
import RoomBio from '@/pages/LobbyRoomPage/RoomBio.vue';
import RoomVinyl from '@/pages/LobbyRoomPage/RoomVinyl.vue';
import LobbyFooter from '@/pages/LobbyRoomPage/LobbyFooter.vue';

export default {
  name: 'home',
  data() {
    return {
      socketConnect: io.connect(this.$store.state.location + 'rooms'),
      currentLocation: window.location.href, /* DEV VALUE */
      activeModal: false,
      currentGenres: this.$store.getters.grabGenre(''),
      detailsActive: false
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
        this.$router.push(`room/${roomData['roomID']}`);
      });
    }, modalActivate: function() {
      this.activeModal = true;
    },
    changeMainDevice: function(data) {
      if (data.hasOwnProperty('id') && typeof data.id === 'string') {
        this.$store.dispatch('changeMainDevice', data);
      }
    },
    showDetails: function() {
      this.detailsActive = true;
    },
    hideDetails: function() {
      this.detailsActive = false;
    },
    closeModal: function() {
      this.activeModal = false;
    }
  },
  mounted() {
    const privateSocket = io.connect(this.$store.state.location);
    this.$store.state.loading = false;
    // this.$store.state.lobby.rooms.push(...mockData);
    // this.$store.commit('addToRooms', mockData);

    this.socketConnect.emit('create_user', {'display_name': this.$store.state.spotifyAPIData.user, 'id': this.$store.state.spotifyAPIData.userID});
    this.socketConnect.on('servers', (data) => {
      this.$store.state.lobby.rooms.push(...data); 
      this.$store.commit('addToRooms', data); 
    });

    privateSocket.on('rooms', (data) => {
      addRooms(data);
    });

    const addRooms = (data, refresh=false) => {
      const _data = data.map(current => JSON.parse(current));

      this.$store.state.lobby.rooms.push(...data);
      this.$store.commit('addToRooms', _data);
      this.$store.state.lobby.rooms.forEach(function(curr, index) {
        // Find the room "name" from data
        let currentData = _data.filter(current => current.name === curr.name)[0];
        if (currentData !== undefined)
          this.$store.state.lobby.rooms[index].users = currentData.users;
      }, this);
    }
  },
  components: {
    RoomCreationModal,
    Navbar,
    RoomSelect,
    RoomBio,
    RoomVinyl,
    LobbyFooter
  }
}
</script>


<style lang="scss" scoped>
  @media (max-width: 66rem) {
    #main_container {
      flex-direction: column;
    }

    .panel-main {
      width: 100% !important;
    }


    #left_panel {
      margin-top: 100px;
      margin-bottom: 50px;
    }

    .home {
      overflow: auto !important;
    }
  }

  .home {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-top: 3rem;
    padding: 0;
    height: 100%;
    overflow: hidden;

    .bx--btn--tertiary {
      background-color: black;
      color: white;
      border-color: black;
      &:focus, &:hover {
        border-color: #ffffff;
        outline: transparent;
        box-shadow: 0px 0px 1px 2px black;
      }
    }

    h1 {
      text-align: center;
      font-style: "IBM Plex Sans";
      position: relative;
      top: 26px;
      background-color: #e2d7ca;
      width: 25%;
      left: 6%;
      font-weight: 500;
    }
    h2#details_heading {
      position: absolute;
      background-color: #e2d7ca;
      top: 12.5%;
      right: 15%;
    }

    #swf {
      font-size: 3.3rem;
      font-weight: bold;
      position: absolute;
      right: 50%;
      .a_right {
        left: 50% !important;
      }
    }

    header {
      padding-top: 30px;
    }

    #main_container {
      display: flex;
      padding: 0px !important;
      height: 80%;
      border: 1px dashed grey;
      width: 95%;
    }

    .dj_banner {
      font-size: 2.5rem;
      font-weight: bold;
      font-family: 'IBM Plex Sans', sans-serif;
      position: absolute;
      &:first-of-type {
        right: 51%;
      }
      &:last-of-type {
        left: 51%;
      }
    }
  }

  h1, h2, h3, h4, h5, h6 {
    text-align: initial;
    font-family: 'Roboto Condensed', sans-serif;
    color: black;
  }

  .panel-main {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    h2 {
      font-family: 'IBM Plex Mono';
    }
  }

  #left_panel {
    min-height: 465px;
  }

  .panel_container { 
    display: flex;
    justify-content: space-between;
    h2 {
      margin-bottom: 30px;
    }
    #modal_create_room {
      height: 30px;
    }
  }

  .slide-in-enter-active {
    animation: wide-in .9s;
  }

  .slide-in-leave-active {
    animation: wide-in .9s reverse;
  }


  @keyframes wide-in {
    0% {
      opacity: 0;
      right: 5%;
    }
    100% {
      opacity: 1;
      right: 15%;
    }
  }


</style>