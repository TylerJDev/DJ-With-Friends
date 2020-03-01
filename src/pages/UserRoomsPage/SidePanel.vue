<template>
  <div id="sidepanel_container" role="tabpanel" :aria-labelledby="giveLabel">
    <ol id="tracklist_panel" v-if="currentPanel === 'Next Up'">

      <li v-for="(item, index) in getQueue" :key="'track_item_' + index">
        <span>{{item.trackName}}</span>
        <br>
        <span>{{item.trackAlbum}}</span>
        <!-- <button class="heart_track" :aria-label="'Favorite Track ' + 'Track_name'" @click="favoriteTrack"><Favorite16/></button> -->
      </li>
    </ol>

    <ol id="history_panel" v-if="currentPanel === 'History'">
      <li v-for="(item, index) in getHistory" :key="'history_item_' + index">
        <span>{{item.trackName}}</span>
        <br>
        <span>{{item.trackAlbum}}</span>
        <!-- <button class="heart_track" :aria-label="'Favorite Track ' + 'Track_name'" @click="favoriteTrack"><Favorite16/></button> -->
      </li>
    </ol>

    <ol id="users_panel" v-if="currentPanel === 'Users'">
      <li v-for="(item, index) in getUsers" :key="'user_item_' + index">
        {{item}}
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  props: {
    currentPanel: String
  },
  methods: {
    favoriteTrack: function() {
      console.log('Track favorited!');
    }
  },
  computed: {
    giveLabel: function() {
      return this.currentPanel.toLowerCase().split(' ').join('') + '_tab';
    },
    getQueue: function() {
      return this.$store.state.rooms.currentQueue;
    },
    getHistory: function() {
      return this.$store.state.rooms.history;
    },
    getUsers: function() {
      return this.$store.state.rooms.users;
    }
  },
}
</script>

<style lang="scss">
  #sidepanel_container {
    font-family: 'IBM Plex Sans', sans-serif;
    padding: 40px;
    ol {
      list-style-type: decimal;
      list-style-position: inside;
    }

    li {
      padding-bottom: 5px;
      margin-bottom: 10px;
      border-bottom: 1px solid black;
      :first-child {
        font-weight: 600;
      }
      span:not(:first-child) {
        margin-left: 15px;
        @include extra_text;
      }

      .heart_track {
        float: right;
        border: none;
        background-color: transparent;
      }
    }
  }
</style>
