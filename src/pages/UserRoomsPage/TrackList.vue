<template>
  <div>
    <table id="tracklist">
      <tr>
        <th>Track</th>
        <th>Artist</th>
        <th>Album</th>
        <th>Duration</th>
      </tr>
      <!-- <tr id="tracks" v-for="(currentTrack, index) in currentTrackData">
        <td v-for="(current, index) in currentTrack">
          {{ current }}
        </td>
      </tr> -->
    </table>
  </div>
</template>

<script>
export default {
  props: {
    currentTrackData: Array
  },
}
</script>

<style>
  table#tracklist {
    width: 100%;
  }
</style>
