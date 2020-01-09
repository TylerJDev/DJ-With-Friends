<template>
  <div class="room_users">
      <div class="user_data_room">
        <button v-for="(item, index) in currentUsers" :key="'currentUser_' + index" class="user_item"><i class="far fa-user"></i></button>
        <span v-if="extraUsers.length > 4" class="plus_users" v-bind:aria-label="'Plus ' + (extraUsers.length - 4) + ' users'">+{{extraUsers.length - 4}}</span>
      </div>
  </div>
</template>

<script>
import LobbyStore from '@/store/modules/lobby.js';

export default {
  name: 'RoomUsers',
  props: {
      rooms: Array
  },
  computed: {
      roomPublic: function() {
          return this.rooms.settings['room-private'] === true ? 'Private' : 'Public';
      },
      currentUsers: function() {
          if (this.rooms !== undefined) {
            return this.rooms.filter((current, index) => index < 4);
          } else {
              return []
          }
      },
      extraUsers: function() {
          return this.rooms !== undefined ? this.rooms : []
      }
  }
}

// NOTE! Test with {{rooms}}, rooms may be giving vital information
</script>

<style lang="scss" scoped>
    .room_users {
        @include card_style;
        .user_amount {
            font-size: 1rem;
            text-align: left;
        }
        .user_item {
            border-radius: 50%;
            height: 30px;
            width: 30px;
            border: none;
            margin: 0px 5px 0px 5px;
            vertical-align: middle;
        }
        .plus_users {
            display: inline-block;
            @extend .user_item;
            border: none;
            vertical-align: inherit;
        }

        .fa-user {
            color: rgb(138, 138, 138);
            font-size:0.9rem;
        }
    }
</style>