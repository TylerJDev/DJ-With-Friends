<template>
  <div id="main">
    <div id="currently_playing">
      <h2>Now Playing</h2> <!-- Only display if current track is playing -->
      <h1>Current Track {{currentTrackPlaying.track}}</h1>
    </div>

    <div id="controls">
      <button class="badge badge-primary custom-badge" v-on:click="addTrack">Add to Queue</button>
      <button class="badge badge-primary custom-badge">Search</button>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Search 2.0</button>
      <button class="btn btn-primary" v-on:click="skipTrack">Skip Track</button>
    </div>
  </div>
</template>

<script>
import TrackList from './TrackList.vue';

export default {
  data() {
    return {
      loginStatus: ''
    }
  },
  props: {
    currentTrackPlaying: Object
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
  }
}
</script>

<style scoped>
  button.custom-badge {
    border: none;
    font-size: 1.3rem;
    margin: 10px;
  }
</style>
