<template>
  <div id="room_bio">
    <div id="card_bio" v-if="getCurrentDisplayed !== undefined && getCurrentDisplayed.settings !== undefined">
      <button id="card_close" aria-label="Close" v-on:click="clearBio">
        <Close16/>
      </button>
      <h2 class="room_name">{{getCurrentDisplayed.settings['room-name']}}</h2>
      <p class="bio_host"><strong>Host:</strong> {{getCurrentDisplayed.display_name}}</p>
      <p class="bio_genre"><strong>Genre:</strong> {{Array.isArray(getCurrentDisplayed.settings['room-genre']) ? getCurrentDisplayed.settings['room-genre'].join(', ').replace(/[_]/g, ' ') : getCurrentDisplayed.settings['room-genre']}}</p>
      <p class="bio_label">Description:</p>
      <p class="bio_description">
        {{getCurrentDisplayed.settings['message-text']}}
      </p>
            
      <a :href="'/room/' + getCurrentDisplayed.name" id="bio_join_btn" class="cv-button bx--btn bx--btn--tertiary">
        Join Room
      </a>

      <div class="users_current">
        <p><strong>Users:</strong></p>
        <ul v-if="getCurrentDisplayed.users !== undefined" id="users_container">
          <li v-for="(user, index) in getCurrentDisplayed.users.slice(0, 5)" :key="'user_' + index" :title="user" :style="[getCurrentDisplayed.userImages !== undefined && getCurrentDisplayed.userImages[index].length ? {backgroundImage: `url('https://profile-images.scdn.co/images/userprofile/default/${getCurrentDisplayed.userImages[index]}')`} : {}]" class="user">
            <i v-if="getCurrentDisplayed.userImages === undefined || !getCurrentDisplayed.userImages[index].length" class="far fa-user"></i>
            <span class="user_name_bio">User: {{user}}</span>
          </li>
          <li><p class="users_more" v-if="getCurrentDisplayed.users.length > 5">+{{getCurrentDisplayed.users.length - 5}} more</p></li>
        </ul>
        <p v-if="getCurrentDisplayed.users === undefined || !getCurrentDisplayed.users.length"><strong>No users found!</strong></p>


      </div>
    </div>
  </div>
</template>

<script>
import { focusEle } from '@/utils/focus.js';

export default {
  name: "RoomBio",
  computed: {
    getCurrentDisplayed: function() {
      return this.$store.getters.grabCurrentDisplayed
    }
  },
  methods: {
    clearBio: function() {
      // Focus back to trigger
      focusEle(`.room_card .room_join > a[href='/room/${this.$store.getters.grabCurrentDisplayed.name}'] ~ .room_details_btn`);
      this.$store.commit('setCurrentDisplayed', {});
      this.$emit('hide-details');
    }
  }
};
</script>

<style lang="scss">
  #room_bio {
    margin-top: 50px;
  }

  #card_bio {
    text-align: left;
    font-family: 'IBM Plex Sans', sans-serif;

    .bx--btn--tertiary {
      background-color: black;
      color: white;
      border-color: black;
    }

    #card_close {
      float: right;
      border: none;
      background-color: transparent;
      width: 25px;
      height: 25px;
      padding: 0px;
    }

    h2.room_name {
      margin-bottom: 20px;
    }

    p.bio_label {
      font-weight: 600;
    }

    #bio_join_btn {
      margin-top: 20px;
    }

    .bio_description {
      max-height: 80px;
      overflow: auto;
      margin-top: 10px;
    }

    .bio_genre {
      text-transform: capitalize;
    }

    .users_current {
      height: 250px;
      overflow: auto;
      margin-top: 20px;
      display: flex;
      #users_container {
        display: flex;
        margin-left: 20px;
        .users_more {
          height: 30px;
          float: left;
          position: relative;
          right: 70px;
          color: black;
          top: 5px;
        }
        .fa-user {
          margin: 0 auto;
          margin-top: 8px;
          font-size: 1.2rem;
          color: #777;
        }
        .user_name_bio {
          @include sr_only;
        }
        .user {
          height: 40px;
          width: 40px;
          border: 1px solid black;
          border-radius: 50%;
          position: relative;
          background-color: #eee;
          display: flex;
          background-size: cover;
        }

        @for $i from 1 through 5 {
          .user:nth-child(#{$i}) {
            right: 15 * $i + px;
          }
        }
      }
      #users_table {
        margin-top: 20px;
        width: 100%;
        font-size: 0.9rem;
        tr {
          border-bottom: 1px solid #707070;
          height: 40px;
          td, th {
            vertical-align: middle;
          }
          th {
            font-weight: 600;
          }
        }
      }
    }
  }
</style>