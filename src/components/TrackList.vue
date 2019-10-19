<template>
  <div>
    <table id="tracklist">
      <tr>
        <th>User</th>
        <th>Next Up</th>
        <th>Artist</th>
        <th>Duration</th>
      </tr>
      <tr id="tracks" v-for="(currentTrack, index) in currentTrackData">
        <td v-for="(current, index) in currentTrack">
          {{ current }}
        </td>
      </tr>
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
