<template>
<cv-modal
  :size="size"
  :primary-button-disabled="primaryButtonDisabled"
  :visible="visible"
  @modal-hidden="closeModal"
    @primary-click="addToQueue"
  :auto-hide-off="autoHideOff"
  id="track_list_modal">
  <template v-if="use_contentWithInput" slot="content">
      <div class="bx--form-item">
        <label for="search-input" class="bx--label" id="search_songs_label">Search Songs<span v-if="this.tracksFound === false" class="warning_msg" role="alert"> - No tracks found!</span></label>
        <div id="input_search_container">
          <form v-on:submit.prevent="searchTracks">
            <input id="search-input" type="text" class="bx--text-input" placeholder="Search for a song" data-modal-primary-focus>
            <button class="text-search_btn" aria-labelledby="search_songs_label"><Search16 /></button>
          </form>
        </div>
      </div>

      <div id="tracks_container">
          <div id="tracks_pane" class="modal_pane" v-if="tracks.length">
            <ol>
              <li v-for="(item, index) in tracks" :key="'track_' + index">
                <button :id="'track_' + index" @focus="changeFeatured" @click.self="changeFeatured" class="track_btn_container">
                  <div class="track_meta_container">
                    <div class="tracks_meta">
                      <span class="track_name">{{item.name.length > 15 ? item.name.substring(0, 14) + ' ...' : item.name}}</span>
                    </div>  
                      <span class="artist_item">{{allArtists.artists[index]}}</span>
                    
                  </div>
                  <span class="track_duration">{{allDurations[index]}}</span>
                </button>
              </li>
            </ol>
          </div>

          <div id="album_pane" class="modal_pane" v-if="tracks.length">
            <div id="album_cover" v-bind:style="{backgroundImage: 'url(' + currentFeaturedTrack.album.images[0].url + ')'}"></div>
            <div id="album_details">
              <h2>{{currentFeaturedTrack.name}}</h2>
              <h3>{{currentFeaturedTrack.album.name}}</h3>     
              <cv-list
                :ordered="ordered">
                <cv-list-item><span class="cv-list-title">Songs</span> <span class="cv-list-amount album-list-item">{{currentFeaturedTrack.album.total_tracks}}</span></cv-list-item>
                <cv-list-item><span class="cv-list-title">Artists</span> <span class="cv-list-name album-list-item">{{allArtists.artists[featuredTrack]}}</span></cv-list-item>
                <cv-list-item><span class="cv-list-title">Year</span> <span class="cv-list-name album-list-item">{{currentFeaturedTrack.album.release_date}}</span></cv-list-item>
              </cv-list>
            </div>
          </div>
      </div>
      </template>
      
  <template v-if="use_secondaryButton" slot="secondary-button">Close</template>
  <template v-if="use_primaryButton" slot="primary-button">Add to Queue 
    <!-- <span id="selected_title"> {{selectedTrack !== '' ? tracks[selectedTrack].name.length > 25 ? tracks[selectedTrack].name.substring(0, 25) + ' ...' : tracks[selectedTrack].name : ''}}</span> -->
  </template>
</cv-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      tracks: [],
      size: "",
      use_contentWithInput: true,
      use_secondaryButton: true,
      use_primaryButton: true,
      primaryButtonDisabled: false,
      autoHideOff: false,
      featuredTrack: 0,
      selectedTrack: '',
      ordered: false,
      tracksFound: true,
    }
  },
  methods: {
    async searchTracks(e, i=0) {
      const userInput = e.target.querySelector('input#search-input').value;
      this.featuredTrack = 0;
      this.selectedTrack = '';

      if (userInput.length) {
        const data = {'access_token': this.$store.state.spotifyAPIData.accessToken};

        let response = await fetch(`${this.$store.state.location}search?search_query=${userInput}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        let res = await response.json();

        try {
          this.tracksFound = res.tracks.items.length > 0;
          
          if (res.tracks.items.length) {
            this.tracks = res.tracks.items;
          }
        } catch(TypeError) {
          const oldAccess = this.$store.state.spotifyAPIData.accessToken;
          this.$store.commit('loadingState', {'status': true});
          this.$store.dispatch('handleReAuth', {refreshFromRooms: true, forceAuth: true}).then(() => {
            this.$emit('refresh-token', oldAccess);
            if (this.$store.state.spotifyAPIData.accessToken === oldAccess) {
              Store.dispatch('handleNotification', {
                timeout: 10000, type: 'error', initialised: true, title: 'Request failed', subtitle: 'Could not request new access token!',
              });
              this.$store.commit('loadingState', {'status': false});
            } else {
              this.$store.commit('loadingState', {'status': false});
              this.searchTracks(e);
            }
          });
        }
      }
    },
    addToQueue() {
      if (this.selectedTrack) {
        const trackDetails = {
          trackURI: this.tracks[this.selectedTrack].uri,
          track: this.tracks[this.selectedTrack].name,
          artist: this.tracks[this.selectedTrack].artists,
          duration: this.tracks[this.selectedTrack]['duration_ms'],
          album: this.tracks[this.selectedTrack].album.name,
          albumImage: this.tracks[this.selectedTrack].album.images,
          whoQueued: this.$store.state.spotifyAPIData.user
        }

        this.$emit('add-queue', trackDetails);
        this.$emit('handle-modal', false);
      }
    },
    closeModal() {
      this.$emit('handle-modal', false);
    },
    changeFeatured(e) {
      var targetElem = e.target;
      
      this.featuredTrack = targetElem.attributes['id'].value.split('_')[1];
      this.selectedTrack = this.featuredTrack;
    },
    featuredTrackReset() {
      this.featuredTrack = 0;
      this.selectedTrack = '';
    }
  },
  computed: {
    allArtists() {
      let artists = [];
      let albumArtists = [];

      this.tracks.forEach((current) => {
        let currentArtists = current.artists.map(curr => curr.name);
        let currentAlbumArtists = current.album.artists.map(curr => curr.name);

        artists.push(currentArtists.join(currentArtists.length > 1 ? ', ' : ''));
        albumArtists.push(currentAlbumArtists.join(currentArtists.length > 1 ? ', ' : ''));
      });

      return {'artists': artists, 'albumArtists': albumArtists};
    },
    allDurations() {
      const convertSeconds = (seconds) => {
        let result1 = Math.floor(seconds / 60); 
        let result2 = Math.round(seconds - (result1 * 60));

        return `${result1}m ${result2}s`;
      }

      const durations = this.tracks.map(current => convertSeconds(current.duration_ms / 1000));
      
      return durations;
    },
    currentFeaturedTrack() {
      if (this.tracks[this.featuredTrack] === undefined) {
        this.featuredTrackReset();
      }

      return this.tracks[this.featuredTrack];
    }
  }
}
</script>

<style lang="scss">
  @mixin noflow {
    overflow: hidden;
    white-space: nowrap;
  }

  @media (max-width: $breakpoint--09) {
    .modal_pane {
      width: 100% !important;
      max-width: 100% !important;
    }
  }

  @media (max-width: $breakpoint--03) {
    .bx--modal-container, .bx--modal-content {
      overflow: initial !important;
    }

    #tracks_container {
      flex-direction: column;
      #tracks_pane {
        width: 100%;
      }
    }

    #tracks_pane {
      height: 190px;
    }
  }
  #track_list_modal {
    .bx--modal-header__heading {
      display: none;
    }
  }

  #input_search_container {
    width: 100%;
    form {
      width: 100%;
      display: flex;
      .text-search_btn {
        border: none;
        background-color: #393939;
        fill: white;
        &:focus, &:active {
          outline: 2px solid #0f62fe;
        }
      }
    }
  }

  .bx--modal-container .bx--modal-content {
    padding-right: 1rem !important;
    overflow: hidden;
     & { max-height: 450px !important; min-height: 450px !important }
  }

  #tracks_container {
    min-height: 345px;
    display: flex;
    width: 100%;
  }

  .modal_pane {
    margin: 5px;
    height: 100%;
    width: 50%;
    padding: 10px;
    font-family: 'IBM Plex Sans', sans-serif;
  }
  
  #tracks_pane {
    max-height: 365px;
    overflow-y: scroll;
    ol > li {
      @include list_style;
      font-size: 1rem;
      height: 35px;
      list-style: none;
      button {
        width: 100%;
        height: 100%;
        padding: 5px;
        border: none;
        background-color: transparent;
        transition: 100ms;
      }

      button:hover, button:active, button:focus {
        background-color: black;
        color: white;
      }
      .artist_item {
        font-size: 0.7rem;
        margin-left: 5px;
        max-width: 95px;
        @include noflow;
      }
      
      .track_name {
        // @include noflow;
        max-width: 150px;
      }

      .track_name, .artist_item {
        float: left;
      }

      .track_duration {
        float: right;
        font-size: 0.8rem;
        font-weight: 600;
      }
    }
  }

  #album_pane {
    padding-top: 15px;
    // max-height: 415px;
    max-width: 360px;
    min-width: 360px; /* Clean this up */
    max-height: 365px;
    overflow-y: scroll;
    #album_cover {
      margin-top: 1rem;
      border: 1px solid grey;
      width: 150px;
      height: 150px;
      margin: auto;
      background-size: cover;
      -webkit-box-shadow: -12px 8px 0px 2px black;
      -moz-box-shadow: -12px 8px 0px 2px black;
      box-shadow: -12px 12px 0px 2px black;
      margin-bottom: 15px;
    }
    h2 {
      font-size: 1rem;
      font-weight: 700;
    }

    #album_details {
      h3 {
        font-size: 0.8rem;
      }
    }

    .cv-list li {
      @include list_style;
      height: 25px;
    }

    .cv-list-title {
      font-weight: 600;
    }

    .album-list-item {
      float: right;
      @include noflow;
      max-width: 260px;
    }
  }

  #selected_title {
    font-size: 0.7rem;
    margin-left: 5px;
  }

  .cv-button.bx--btn.bx--btn--primary {
    justify-content: normal;
  }

  .track_btn_container {
    display: flex;
    justify-content: space-between;

    .track_meta_container {
      display: flex;
      .tracks_meta {
        width: 135px;
        overflow: hidden;
        display: inline-block;
        position: relative;
      }

      .tracks_meta:hover {
        color: white !important;
      }

      .track_name {
        white-space: nowrap;
        position: relative;
        right: 0px;
      }

      // .scroll_with {
      //   transition: 3500ms;
      // }

      // .scroll_with:hover {
      //   color: white;
      //   transition: 8000ms;
      //   right: 450px;
      // }
    }
  }

  .bx--modal-footer {
    .bx--btn--primary {
      white-space: nowrap;
    }
  }

  .warning_msg {
    color: red;
    margin-left: 5px;
  }
</style>
