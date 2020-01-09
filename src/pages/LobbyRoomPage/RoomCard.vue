<template>
  <div class="room_card">
      <a v-bind:href="'/room/' + rooms.name" class="room_link">
        <h2>{{rooms.settings['room-name']}}</h2>
        <h3 class="room_display_name">Host: {{rooms['display_name']}}</h3>
        <p class="room_description">{{rooms.settings['message-text']}}</p>

        <div class="room_meta">
            <p class="room_genre">Genre: {{rooms.settings['room-genre']}}</p>
            <p class="room-lock">{{roomPublic}}<i v-bind:class="[this.rooms.settings['room-private_'] ? 'fas fa-lock' : 'fas fa-lock-open']"></i></p>
        </div>
      </a>
  </div>
</template>

<script>
export default {
  name: 'userItem',
  props: {
      rooms: Object
  },
  computed: {
      roomPublic: function() {
          return this.rooms.settings['room-private_'] === true ? 'Private' : 'Public';
      }
  }
}

// NOTE! Test with {{rooms}}, rooms may be giving vital information
</script>

<style lang="scss" scoped>
    .room_card {
        @include card_style;    
        h2 {
            font-size: 1.8rem;
        }

        h3 {
            font-size: 1.2rem;
        }

        p {
             font-family: 'Raleway', sans-serif;
        }

        .room_meta p {
            display: inline-block;
            margin: 0px 20px 0px 0px;
        }

        .room_link {
            text-decoration: none !important;
            color: black;
        }

        .room_meta .fas {
            font-size: 0.9rem;
            margin-left: 8px;
        }
    }
</style>