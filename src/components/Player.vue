<template>
  <div id="main">
    <div id="currently_playing">
      <h2>Now Playing</h2> <!-- Only display if current track is playing -->
      <h1>Current Track</h1>
    </div>

    <div id="controls">
      <button class="badge badge-primary custom-badge" v-on:click="addTrack">Add to Queue</button>
      <button class="badge badge-secondary custom-badge">Skip current playing</button>
      <button class="badge badge-secondary custom-badge">Login</button>
    </div>

    <h2>Login Status: {{logStatus.state}}, Token: {{logStatus.token}}</h2>
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
  computed: {
    logStatus: function() {
      return {'state': this.$store.state.isLoggedIn, 'token': this.$store.state.spotifyAPIData.authCode};
    }
  },
  methods: {
    addTrack: function(event) {
      this.$emit('add-track', {'user': 'Tyler', 'name': 'Drive In', 'artist': 'MED, Blu, Madlib, Aloe Blacc', 'duration': '3:59'});
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
