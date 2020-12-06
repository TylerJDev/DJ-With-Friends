<template>
  <div id="sidepanel_container" role="tabpanel" :aria-labelledby="giveLabel">
    <ol id="tracklist_panel" v-if="currentPanel === 'Next Up'">

      <li v-for="(item, index) in getQueue" :key="'track_item_' + index">
        <h3 class="panel-heading">{{item.trackTitle}}</h3>
        <span>
          <cv-interactive-tooltip :alignment="alignment" :direction="direction"
          :visible="visible">
            <template v-if="use_label" slot="label">
              <span class="sr_hide">More info about {{item.trackTitle}}</span>
            </template>
            <template v-if="use_trigger" slot="trigger"><InformationFilled16 class="bx--overflow-menu__icon bx--toolbar-filter-icon" />
            </template>
            <template v-if="use_content" slot="content">
              <h3 class="tooltip_heading">{{item.trackTitle}}</h3>
              <p>Album: <em>{{item.albumTitle}}</em></p>
              <p>Track Duration: <em>{{getDuration[0][index]}}</em></p>
              <p>Track Artists: <em>{{getArtists[0][index].join(' ')}}</em></p>

              <br/>
              <a target="_blank" :href="'https://open.spotify.com/track/' + item.trackURI.split('track:')[1]">View on Spotify</a>
              <button class="bx--button tooltip">Close</button>
            </template>
          </cv-interactive-tooltip>
        </span>
        <br>
        <h4 class="panel-sub-heading">{{item.albumTitle}}</h4>
        <!-- <button class="heart_track" :aria-label="'Favorite Track ' + 'Track_name'" @click="favoriteTrack"><Favorite16/></button> -->

        <span class="added_by bx--tooltip__label" v-if="users.indexOf(item.whoQueued) >= 0">Added by {{item.whoQueued}}</span>
      </li>
    </ol>

    <ol id="history_panel" v-if="currentPanel === 'History'">
      <li v-for="(item, index) in getHistory" :key="'history_item_' + index">
        <h3 class="panel-heading">{{item.track}}</h3>
        <span>
          <cv-interactive-tooltip :alignment="alignment" :direction="direction"
          :visible="visible">
            <template v-if="use_label" slot="label">
              <span class="sr_hide">More info about {{item.track}}</span>
            </template>
            <template v-if="use_trigger" slot="trigger"><InformationFilled16 class="bx--overflow-menu__icon bx--toolbar-filter-icon" />
            </template>
            <template v-if="use_content" slot="content">
              <h3 class="tooltip_heading">{{item.track}}</h3>
              <p><strong>Album:</strong> <em>{{item.album}}</em></p>
              <p>Track Duration: <em>{{getDuration[1][index]}}</em></p>
              <p>Track Artists: <em>{{getArtists[1][index].join(' ')}}</em></p>

              <br/>
              <a target="_blank" :href="'https://open.spotify.com/track/' + item.trackURI.split('track:')[1]">View on Spotify</a>
              <button class="bx--button tooltip">Close</button>
            </template>
          </cv-interactive-tooltip>
        </span>
        <br>
        <h4 class="panel-sub-heading">{{item.album}}</h4>
        <!-- <button class="heart_track" :aria-label="'Favorite Track ' + 'Track_name'" @click="favoriteTrack"><Favorite16/></button> -->
        <span class="added_by bx--tooltip__label" v-if="users.indexOf(item.whoQueued) >= 0">Added by {{item.whoQueued}}</span>
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
    currentPanel: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      alignment: 'center',
      direction: 'right',
      use_label: true,
      use_trigger: true,
      use_content: true,
      visible: false,
      users: this.$store.state.rooms.users
    }
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
    },
    getDuration: function() {
      let tracksDuraiton = [[], []];
      this.getQueue.forEach((curr) => {
        const totalSeconds = curr.duration / 1000;
        let result = [Math.floor(totalSeconds / 60), Math.floor(totalSeconds - (Math.floor(totalSeconds / 60) * 60))];
        
        if (result[1] < 10) {
          result[1] = '0' + result[1]
        } else if (result[1] === 60) {
          result[0] += 1
          result[1] = '00';
        }

        if (result !== undefined || result !== null) {
          tracksDuraiton[0].push(result.join(':'));
        }
      });

      this.getHistory.forEach((curr) => {
        const totalSeconds = curr.duration / 1000;
        let result = [Math.floor(totalSeconds / 60), Math.floor(totalSeconds - (Math.floor(totalSeconds / 60) * 60))];
        
        if (result[1] < 10) {
          result[1] = '0' + result[1]
        } else if (result[1] === 60) {
          result[0] += 1
          result[1] = '00';
        }

        if (result !== undefined || result !== null) {
          tracksDuraiton[1].push(result.join(':'));
        }
      });

      return tracksDuraiton;
    },
    getArtists: function() {
      let artists = [[], []];

      this.getQueue.forEach((curr) => {
        artists[0].push(curr.artist.map(curr => curr.name));
      });

      this.getHistory.forEach((curr) => {
        artists[1].push(curr.artist.map(curr => curr.name));
      });

      return artists;
    }
  },
}
</script>

<style lang="scss">
  .tooltip_heading {
    font-size: 1rem !important;
    line-height: 1rem;
    margin-bottom: 10px;
  }
  #sidepanel_container {
    font-family: 'IBM Plex Sans', sans-serif;
    padding: 40px;
    
    ol {
      list-style-type: decimal;
      list-style-position: inside;
      h3.panel-heading {
        font-size: 0.9rem !important;
        display: inline;
      }

      .sr_hide {
        @include sr_only;
      }

      h4.panel-sub-heading {
        font-size: 0.8rem;
        color: #e4e4e4;
      }
    }

    .cv-interactive-tooltip {
      display: inline;
      .bx--tooltip__trigger {
        margin-left: 0px;
      }
    }

    .added_by {
      font-weight: normal !important;
      font-style: italic;
      display: block;
      color: #e4e4e4;
      margin-left: 0px !important;
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
