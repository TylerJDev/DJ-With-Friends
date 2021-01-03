<template>
  <div id="main" class="container">
    <div class="row">
      <div id="current_track" class="col-md-8">
        <div>
          <div id="artist_container" :style="{'backgroundImage': `url(${grabCurrentImageAlbum})`}">
          </div>

          <div id="current_playing_data">
            <div id="current_song">
              <transition name="slide-fade">
                <h1 v-if="this.$store.getters.grabCurrentPlaying.track !== ''">{{(this.$store.getters.grabCurrentPlaying.track === '') ? 'No Song Playing!' : currentPlaying.track}}</h1>
              </transition>
            </div>
            <div id="current_album">
              <h2 :style="{'fontSize': currentPlaying.track.length > 21 ? '1rem' : '2rem'}">{{currentPlaying.album}}</h2>  
            </div>
          </div>
        </div>

        <div id="track_controls">
          <div class="controls">     
            <button
            class="bx--btn bx--btn--primary"
            type="button" id="add_to_queue_btn" @click="addSong">
              Add to Queue
              <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--btn__icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M9 7L9 3 7 3 7 7 3 7 3 9 7 9 7 13 9 13 9 9 13 9 13 7z"></path></svg>
            </button> 
            <span v-if="(this.$store.getters.grabVotes.votes && this.$store.getters.grabVotes.votes >= 1)" role="alert" class="user-votes">{{this.$store.getters.grabVotes.votes}} Users Voted to Skip</span>
            <button
            class="bx--btn bx--btn--secondary"
            type="button" id="skip_btn" :disabled="this.$store.getters.grabIfVoted" @click="skipTrack">
            Skip
            </button> 

            <button
            class="bx--btn bx--btn--secondary"
            type="button" id="host_btn" :disabled="this.$store.getters.grabIfVoted" @click="host">
              <span v-if="isHosting">Stop Hosting</span>
              <span v-if="!isHosting">Host</span>
            </button> 
            
          </div>
          
          <div id="progress_bar">
            <div id="progress_times">
              <p class="initial">{{currentDuration.join(':')}}</p>
              <p class="end">{{duration[0]}}</p>
            </div>
            <div id="progress"><div id="progress__innerbar" :style="{'width': currentProgress}"></div></div>
          </div>

        </div>
      </div>

      <div id="side_panel_col" class="col">
        <div id="currently_playing" style="display: none">
          <h1>{{currentTrackPlaying.track}}</h1>
          <h2>By</h2> <a v-for="link in currentTrackPlaying.artist" v-bind:key="link.id" v-bind:href="link.external_urls.spotify" target="_blank" class="artist_name">{{link.name}}</a>

          <div id="track_options">
            <button class="btn btn-primary" v-on:click="skipTrack">Skip</button>  
          </div>
        </div>

        <div id="side_panel">

          <div id="side_panel_tablist" role="tablist" aria-label="Side Panel">
            <button 
              id="nextup_tab"
              :class="activatedTab === 'Next Up' ? 'side_panel_tab side_panel_active' : 'side_panel_tab'" 
              role="tab" 
              :aria-selected="activatedTab === 'Next Up' ? 'true' : 'false'" 
              @click="sideTab" 
              :tabindex="activatedTab === 'Next Up' ? 0 : -1">Next Up</button>
            <button
              id="history_tab" 
              :class="activatedTab === 'History' ? 'side_panel_tab side_panel_active' : 'side_panel_tab'" 
              role="tab" 
              :aria-selected="activatedTab === 'History' ? 'true' : 'false'" 
              @click="sideTab" :tabindex="activatedTab === 'History' ? 0 : -1">History</button>
            <button
              id="users_tab" 
              :class="activatedTab === 'Users' ? 'side_panel_tab side_panel_active' : 'side_panel_tab'" 
              role="tab" 
              :aria-selected="activatedTab === 'Users' ? 'true' : 'false'" 
              @click="sideTab" 
              :tabindex="activatedTab === 'Users' ? 0 : -1">Users</button>
          </div>
          <SidePanel :currentPanel="activatedTab"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidePanel from '@/pages/UserRoomsPage/SidePanel.vue';
import AddFilled16 from '@carbon/icons-vue/es/add--filled/16.js';
import { setupTabSet } from '@/utils/tabset.js';

export default {
  data() {
    return {
      loginStatus: '',
      kind: 'primary',
      disabled: this.$store.getters.grabCurrentVotes.voted,
      icon: AddFilled16,
      activatedTab: 'Next Up',
      visibleModal: false,
      size: ''
    }
  },
  props: {
    currentTrackPlaying: {
      type: Object,
      default: { track: 'No song playing!', artist: ''} 
    }
  },
  computed: {
    logStatus: function() {
      return {'state': this.$store.state.isLoggedIn, 'token': this.$store.state.spotifyAPIData.authCode};
    },
    currentPlaying: function() {
      return this.$store.getters.grabCurrentPlaying;
    },
    duration: function() {
        let seconds = this.currentPlaying.duration / 1000;
        let result1 = Math.floor(seconds / 60); 
        let result2 = Math.round(seconds - (result1 * 60));

        if (result2 < 10) {
          result2 = '0' + result2;
        } else if (result2 === 60) {
          result1 += 1;
          result2 = '00';
        }

        return [`${result1}:${result2}`, seconds]; 
    },
    currentDuration: function() {
      let totalSeconds = this.$store.getters.grabCurrentProgress;
      let result = [Math.floor(totalSeconds / 60), totalSeconds - (Math.floor(totalSeconds / 60) * 60)];

      if (result[1] < 10) {
        result[1] = '0' + result[1]
      } else if (result[1] === 60) {
        result[0] += 1
        result[1] = '00';
      }

      return result;
    },
    trackSkip: function() {
      let currentVotes = this.$store.state.rooms.toSkip.votes.length;
      let neededVotes = this.$store.state.rooms.toSkip.requiredVotes;
      return [currentVotes, neededVotes];
    },
    currentProgress: function() {
      let grabCurrent = Math.floor(this.$store.getters.grabCurrentProgress);

      return grabCurrent > 0 ? String(grabCurrent / this.duration[1] * 100) + '%' : '0';
    },
    grabCurrentImageAlbum() {
      const currentTrack = this.$store.getters.grabCurrentPlaying;
      let albumImage = '';
      if (currentTrack.hasOwnProperty('albumImage') && currentTrack.albumImage.length) {
        albumImage = currentTrack.albumImage[0].url;
      }

      return albumImage;
    },
    isHosting: function() {
      return this.$store.getters.grabIfHosting;
    }
  },
  methods: {
    addSong: function() {
      this.$emit('handle-modal', true);
    },
    skipTrack: function() {
      this.$emit('skip-track');
      this.$store.commit('votedSkip');
    },
    sideTab: function(event) {
      const elem = event.target;
      this.activatedTab = elem.textContent;
    },
    host: function() {
      this.$store.commit('setHosting', this.isHosting === true ? false : true);
      this.$emit('handle-host', this.isHosting);
    }
  },
  mounted() {
    // Setup tabset(s)
    setupTabSet(document.querySelectorAll('#side_panel_tablist [role="tab"]'));
  },
  components: {
    SidePanel,
  }
}
</script>

<style lang="scss" scoped>
  @import url(https://fonts.googleapis.com/css?family=Oswald&display=swap);

   @media (max-width: $breakpoint--12) {
    #track_controls {
      margin-left: 15px;
      #add_to_queue_btn {
        width: 72%;
        display: block;
      }

      #host_btn, #skip_btn {
        margin-top: 5px;
      }
    }
  }

  @media (max-width: $breakpoint--09) {
    #progress_bar {
      width: 230px !important;
    } 

    div.controls {
      width: 300px;
    }

    #add_to_queue_btn {
      width: 67% !important;
    }
    
    // #main {
    //   min-width: 850px !important;
    // }

    #side_panel .side_panel_active {
      font-size: 1.5rem;
    }

    #side_panel #side_panel_tablist {
      margin-left: 5px !important;
    }

    #side_panel_col {
      margin-top: 75px;
    }

    #current_playing_data h1 {
      font-size: 2rem;
    }

    #current_album h2 {
      font-size: 1.5rem;
    }
  }

  @media (max-width: $breakpoint--03) {
    #current_track {
      flex-direction: column !important;
      margin-top: 15% !important;
    }

    #artist_container {
      margin: 0 auto;
      box-shadow: none !important;
    }

    #current_playing_data {
      position: initial !important;
      margin-top: 20px;
      h1 {
        font-size: 1.5rem !important;
        text-align: center;
      }

      h2 {
        font-size: 1.1rem !important;
      }
    }

    #controls {
      display: flex;
    }

    #progress_times {
      display: flex !important;
      flex-direction: row !important;
      margin-top: 5% !important;
    }

    #progress_bar {
      width: 100% !important;
      padding-left: 30px;
      padding-right: 30px;
    }

    #track_controls > .controls {
      width: 100%;
      display: flex;
      #add_to_queue_btn {
        width: 40% !important;
        white-space: nowrap;
      }
      > button {
        margin: 0 auto;
      }
      & {
        margin-left: 0px !important;
      }
    }

    #side_panel {
      box-shadow: 3px 10px 0px 2px rgba(0, 0, 0, 0.75) !important;
    }

    #side_panel_col {
      margin-top: 25% !important;
      margin-bottom: 20%;
    }

    #side_panel_tablist {
      top: -18% !important;
    }

    .side_panel_tab {
      font-size: 1.5rem;
    }

    .side_panel_tab.side_panel_active {
      font-size: 2rem !important;
    }

    #track_controls {
      margin-left: 0px !important;
      .controls {
        justify-content: center !important;
      }
      button {
        margin: 1px !important;
        border: 1px solid whitesmoke;
      }
      #add_to_queue_btn svg {
        display: none;
      }
    }
  }

  h1, h2, h3, h4 {
    font-family: 'IBM Plex Sans', sans-serif;
  }

  button.custom-badge {
    border: none;
    font-size: 1.3rem;
    margin: 10px;
  }

  #artist_container {
    width: 300px;
    height: 300px;
    border: 1px solid black;
    -webkit-box-shadow: -30px 23px 0px 2px rgba(0,0,0,0.75);
    -moz-box-shadow: -30px 23px 0px 2px rgba(0,0,0,0.75);
    box-shadow: -30px 23px 0px 2px rgba(0,0,0,0.75);
    background-size: cover;
  }

  .container {
    text-align: initial;
    #currently_playing {
      h2 {
        font-size: 1rem;
      }
    }
  }

  #progress_bar {
    width: 280px;
    #progress {
      width: 100%;
      height: 10px;
      border: 1px solid black;
      margin-bottom: 30px;
      float: right;
    }
    #progress__innerbar {
      background-color: black;
      height: 100%;
      max-width: 100%;
    }
  }

  #currently_playing {
    h2 {
      margin: 1.5px;
      display: inline-block;
    }
    a.artist_name {
      margin: 5px;
    }
  }

  #current_playing_data {
    position: absolute;
    top: 10%;
    left: 47%;
    h1 {
      font-weight: bold;
      font-size: 2.45rem;
    }

    h2 {
      font-weight: 600;
      font-size: 1.3rem;
      text-align: center;
    }
  }

  #current_track {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 50px;
  }

  #progress_times {
    @extend #current_track;
    justify-content: space-between;
  }

  #track_controls {
    display: flex;
    flex-direction: column-reverse;
    margin-bottom: 20px;
  }

  .controls {
    button {
      margin-left: 0px;
      margin-right: 5px;
    }
  }

  #skip_btn {
    max-width: 50px;
    .vote_skips {
      margin-left: 2px;
    }
  }

  #host_btn {
    width: 120px;
    white-space: nowrap;
  }

  #side_panel {
    border: 1px solid black;
    height:100%;
    -webkit-box-shadow: 10px 10px 0px 2px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 0px 2px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 0px 2px rgba(0,0,0,0.75);
    max-height: 350px;
    overflow: hidden;
    overflow-y: inherit;

    #side_panel_tablist {
      position: absolute;
      top: -4%;
      margin-left: 20px;
    }
    .side_panel_tab {
      font-weight: 600;
      font-size: 1rem;
      border: none;
      background-color: transparent;
    }

    .side_panel_active {
      font-size: 2rem;
      font-weight: bold;
      transition: all 0.2s ease-in-out;
    }

    [aria-selected="false"] {
      vertical-align: top;
    }
  }

  /* Transitions */
  .slide-fade-enter-active {
    transition: all .8s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
   /* .slide-fade-leave-active below version 2.1.8 */ {
     transform: translateX(10px);
     opacity: 0;
  }

  .user-votes {
    background-color: black;
    border: 1px solid white;
    color: white;
    padding: 3px;
    bottom: 75px;
    position: absolute;
    font-size: 0.7rem;
  }
</style>
