<template>
  <div id="room_list">
      <div class="container-fluid">
        <div class="row">
            <div id="genre_col" class="col">
                <h3 class="col_heading">Filter By</h3>

                <div id="filter_container">
                  <div id="genres">
                      <button class="genres_btn" v-for="(item, index) in grabGenres" v-bind:key="index" v-on:click="filterBy" :class="item === filter ? 'active' : ''">{{item}}</button>
                  </div>

                  <div id="footer_links">
                    <a href="/about">About</a>
                    <a href="/">Need Help?</a>
                  </div>
                </div>
            </div>
            
            <div id="rooms_col" class="col-8">
                <hr/>
                <button type="button" id="modal_create_room" class="btn btn-primary" data-toggle="modal" data-target="#room_create_modal" v-on:click="activeModal = true">Create Room</button>
                <div>
                  <RoomCard v-for="(item, index) in roomResults" :rooms="item" :key="'room_item' + index"/>
                </div>
            </div>

            <div id="user_col" class="col">
                <h3 class="col_heading">Users</h3>
                <div id="column_user">
                  <RoomUsers v-for="(item, index) in roomResults" :rooms="grabUsers(index)" :key="'user_item' + index"/>
                </div>
            </div>
        </div>

        <div id="pagination" class="col">
          {{grabPages()}}
          <LobbyFooter />
        </div>
      </div>
  </div>
</template>

<script>
import RoomCard from '@/pages/LobbyRoomPage/RoomCard.vue';
import RoomUsers from '@/pages/LobbyRoomPage/RoomUsers.vue';
import LobbyFooter from '@/pages/LobbyRoomPage/LobbyFooter.vue';
import LobbyStore from '@/store/modules/lobby.js';

export default {
  name: 'RoomList',
  props: {
      genres: Array
  },
  data() {
    return {
      roomResults: LobbyStore.state.rooms,
      filter: 'All',
      activeModal: false
    }
  },
  watch: {
    rooms: function() {
      this.filterBy(this.filter);
    }
  },
  computed: {
    grabGenres: function() {
      const currentGenres = new Set(LobbyStore.state.rooms.map(curr => curr.settings['room-genre']).sort());
      return currentGenres;
    }
  },
  methods: {
    grabUsers: function(idx) {
      if (LobbyStore.state.rooms[idx] !== undefined)
        return LobbyStore.state.rooms[idx].users;
    },
    filterBy: function(e) {
      const targetGenre = typeof e === 'string' ? e : e.target.textContent;
      this.filter = targetGenre;

      if (targetGenre === 'All') {
        this.roomResults = LobbyStore.state.rooms;
        return true;
      }

      this.roomResults = LobbyStore.state.rooms.filter(curr => curr.settings['room-genre'].includes(targetGenre));
    },
    grabPages: function() {
      console.log(this.$store.getters.grabPages);
      return this.$store.getters.grabPages.map(x => x.settings['room-genre']);
    }
  },
  components: {
    RoomCard,
    RoomUsers,
    LobbyFooter
  }
}
</script>

<style lang="scss" scoped>
  #modal_create_room {
    display: block;
    margin-bottom: 20px;
    color: white;
    background-color: black;
    border: none;
  }

  .container-fluid {
      margin-top: 3rem;
  }

  h1, h2, h3, h4, h5, h6 {
    text-align: initial;
    font-family: 'Roboto Condensed', sans-serif;
    color: black;
  }

  .col_heading {
      text-align: center;
  }

  hr {
      border: 1px solid #eee;
  }
  #genres {
    margin-top: 30px;
    .genres_btn {
      border: none;
      background-color: transparent;
      font-family: 'Raleway', sans-serif;
      font-size: 1.5rem;
      text-align: left;
      display: block;
      margin-left: 45px;
      font-weight: light;
      color: grey;
    }

    .active {
      color: black;
    }
  }

  #filter_container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 50vh;
  }

  #footer_links {
    position: absolute;
    bottom: 0;
    a {
      margin: 10px;
      @include help_link;
    }
  }

  .room-card {
    height: 300px;
  }

  #column_user {
    margin-top: 57px;
  }
</style>