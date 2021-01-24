<template>
  <div class="room_card container">
    <a :href="'/room/' + rooms.name" class="room_card_link">
        <h2 class="room_name">
            {{rooms.settings['room-name']}} 
            <span><i v-bind:class="[this.rooms.settings['room-private_'] ? 'fas fa-lock' : 'fas fa-lock-open']"> </i> 
                <span class="lock">Room is {{this.rooms.settings['room-private_'] ? 'Private' : 'Public'}}</span>
            </span>

            <span class="room_full" v-if="isFull">Full</span>
        </h2> 

        <p class="room_display_name">Host: {{rooms['display_name']}}</p>
    </a>

    <div class="room_join">
        <router-link :to="'/room/' + rooms.name" class="room_link">Join Room</router-link>
        <button class="room_details_btn" @click="showDetails" :data-server-id="this.rooms.server_id">View Details</button>
    </div>
  </div>
</template>

<script>
import { focusEle } from '@/utils/focus.js';

export default {
  name: 'userItem',
  props: {
      rooms: Object
  },
  methods: {
      showDetails: function(e) {
          const targetID = e.target.getAttribute('data-server-id');
          let currentRoom;
          this.$emit('show-details', true);

          if (targetID.length) {
              currentRoom = this.$store.getters.grabPages({}).filter((current) => {
                if (current.server_id === targetID) {
                    return current;
                }
              });
          }

          if (currentRoom.length) {
              this.$store.commit('setCurrentDisplayed', currentRoom[0]);
          }
          setTimeout(function() {
            focusEle('#card_close', '#card_bio');
          }, 1000);
      }
  },
  computed: {
    roomPublic: function() {
        return this.rooms.settings['room-private_'] === true ? 'Private' : 'Public';
    },
    isFull: function() {
        const currentRoom = this.$store.getters.grabPages({}).filter((current) => {
            if (current.server_id === this.rooms.server_id) {
                return current;
            }
        });
        return (currentRoom[0].users.length >= this.rooms.settings['user-limit_'] && this.rooms.settings['user-limit_'] !== false);
    }
  }
}

// NOTE! Test with {{rooms}}, rooms may be giving vital information
</script>

<style lang="scss" scoped>
    @media (max-width: 66rem) {
        .room_card h2.room_name {
            font-size: 0.8rem !important;
            width: 100px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .room_link {
            width: 80px !important;
            height: 30px !important;
            line-height: 1.7rem;
            font-size: 0.7rem;
        }
    }

    .room_card {
        @include card_style;    
        h2.room_name {
            margin-top: 5px;
            font-size: 1rem;
            line-height: 1.5rem;
            font-family: 'IBM Plex Sans', sans-serif;
        }

        h3 {
            font-size: 0.8rem;
        }

        .room_display_name {
            font-size: 0.7rem;
        }

        p {
            font-family: 'IBM Plex Sans', sans-serif;
            font-weight: 300;
        }

        .room_meta p {
            display: inline-block;
            margin: 0px 20px 0px 0px;
        }

        .room_card_link {
            text-decoration: none !important;
            color: black !important;
        }

        .room_link {
            text-decoration: none !important;
            color: black;
            border: 1px solid black;
            width: 100px;
            height: 30px;
            border-radius: 13px;
            display: inline-block;
            text-align: center;
            line-height: 1.7rem;
            &:last-of-type {
                margin-left: 5px;
            }
            &:hover, &:active, &:focus {
                background-color: black;
                color: white;
            }
        }

        .room_details_btn {
            @extend .room_link;
            background-color: transparent;
        }

        .room_join {
            margin: auto;
            margin-right: 0;
        }

        .fas {
            font-size: 0.7rem !important;
        }

        .lock {
            @include sr_only;
        }

        .room_full {
            font-size: 0.8rem;
            border-radius: 5%;
            border: 1px solid white;
            margin-left: 5px;
            width: 20px;
            background-color: black;
            padding-left: 5px;
            padding-right: 5px;
        }
    }
</style>