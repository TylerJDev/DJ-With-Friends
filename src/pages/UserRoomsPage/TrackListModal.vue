<template>
  <div id="track_modal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg">
     <div class="modal-content">
        <div id="search_container">
          <form role="search" v-on:submit.prevent="searchTracks">
            <label for="search-input">Search</label>
            <input type="text" class="search_input" id="search-input">

            <input value="Submit" type="submit">
          </form>
        </div>

        <div id="tracks_container">
          <ul>
            <li v-for="(current, index) in tracks" v-bind:key="index" v-bind:id="'track_' + index">{{ current.name }} <button class="add-to-queue" v-on:click="addToQueue" data-dismiss="modal">+</button></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tracks: [],
    }
  },
  methods: {
    async searchTracks(e) {
      const userInput = this.$el.querySelector('#search-input').value;

      if (userInput.length) {
        const data = {'access_token': this.$store.state.spotifyAPIData.accessToken};

        let response = await fetch(`http://localhost:3000/search?search_query=${userInput}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        let res = await response.json();
        console.log(res);

        try {
          if (res.tracks.items.length) {
            this.tracks = res.tracks.items;
            console.log(this.tracks)
          }
        } catch(TypeError) {
          alert('Error occurred! Your access token might\'ve expired!');
        }
      }
    },
    addToQueue(e) {
      const trackCurrent = e.target.parentElement.getAttribute('id').match(/[0-9]/g)[0];      
      const trackDetails = {
        trackURI: this.tracks[trackCurrent].uri,
        trackName: this.tracks[trackCurrent].name,
        trackArtist: this.tracks[trackCurrent].artists,
        trackDuration: this.tracks[trackCurrent]['duration_ms']
      }

      console.log(trackDetails);
      // Add to queue
      this.$emit('add-queue', trackDetails);
    }
  }
}
</script>

<style scoped>
  form .form-group, form .checkbox-group {
    display: flex;
    justify-content: left;
  }

  .modal-dialog {
    max-width: 750px;
  }
</style>
