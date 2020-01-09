<template>
  <div id="main" class="container">
    <div class="row">
      <div id="current_track" class="col-md-6">
        <div id="artist_container">
        </div>
      </div>

      <div class="col">
        <div id="currently_playing">
          <h1>{{currentTrackPlaying.track}}</h1>
          <h2>By</h2> <a v-for="link in currentTrackPlaying.artist" v-bind:key="link.id" v-bind:href="link.external_urls.spotify" target="_blank" class="artist_name">{{link.name}}</a>

          <div id="progress_bar">
            <div id="progress"></div>
          </div>

          <div id="track_options">
            <button class="btn btn-primary" v-on:click="skipTrack">Skip</button>  
          </div>
        </div>

        <div id="queue">
          <h2>Queue</h2>
          <TrackList v-bind:currentTrackData="currentTrackData"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrackList from '@/pages/UserRoomsPage/TrackList.vue';

export default {
  data() {
    return {
      loginStatus: ''
    }
  },
  props: {
    currentTrackPlaying: Object,
    currentTrackData: Array
  },
  computed: {
    logStatus: function() {
      return {'state': this.$store.state.isLoggedIn, 'token': this.$store.state.spotifyAPIData.authCode};
    }
  },
  methods: {
    addTrack: function(event) {
      this.$emit('add-track', {'user': 'Tyler', 'name': 'Drive In', 'artist': 'MED, Blu, Madlib, Aloe Blacc', 'duration': '3:59'});
    },
    skipTrack: function() {
      this.$emit('skip-track');
    }
  },
  components: {
    TrackList,
  }
}
</script>

<style lang="scss" scoped>
  @import url(https://fonts.googleapis.com/css?family=Oswald&display=swap);

  #main {
    margin-top: 100px;
  }

  h1 {
    font-family: 'Oswald', sans-serif;
  }

  button.custom-badge {
    border: none;
    font-size: 1.3rem;
    margin: 10px;
  }

  #artist_container {
    width: 350px;
    height: 350px;
    border: 1px solid black;
  }

  .container {
    text-align: initial;
    #currently_playing {
      h2 {
        font-size: 1rem;
      }
    }
  }

  #progress {
    width: 500px;
    height: 20px;
    border: 1px solid black;
  }

  #queue {
    margin-top: 50px;
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
</style>
