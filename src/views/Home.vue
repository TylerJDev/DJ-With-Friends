<template>
  <div class="home">
    <Player @add-track="handleTrackAddition"/>
    <TrackList v-bind:currentTrackData="currentTrackData"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Player from '@/components/Player.vue'
import TrackList from '@/components/TrackList.vue'

export default {
  name: 'home',
  data() {
    return {
      currentTrackData: [{'user': 'Tyler', 'name': 'Drive In', 'artist': 'MED, Blu, Madlib, Aloe Blacc', 'duration': '3:59'}]
    }
  },
  methods: {
    handleTrackAddition(value) {
      this.currentTrackData.push(value);
    }
  },
  components: {
    Player,
    TrackList
  }
}
</script>
