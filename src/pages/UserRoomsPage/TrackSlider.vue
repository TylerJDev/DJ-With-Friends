<template>
  <div id="trackslider_container">
    <div class="container">      
      <cv-tabs :container="container" aria-label="navigation tab label">
        <cv-tab label="Queue">
          <div class="row">
            <div v-for="(item, index) in queueAlbumImages" :key="'album_item_' + index" class="album_cover" v-bind:style="{backgroundImage: 'url(' + item + ')'}">
                <!-- <h3>{{trackDataQueue[index].trackName}}</h3>
                <h4>{{trackDataQueue[index].trackAlbum}}</h4> -->
            </div>
          </div>
        </cv-tab>

        <cv-tab label="History">
            <div class="row">
              <div v-for="(item, index) in historyAlbumImages" :key="'album_item_' + index" class="album_cover" v-bind:style="{backgroundImage: 'url(' + item + ')'}">
                <!-- <h3>{{trackDataHistory[index].trackName}}</h3>
                <h4>{{trackDataHistory[index].trackAlbum}}</h4> -->
              </div>
          </div>
        </cv-tab>
      </cv-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      "container": false,
      "selected": false,
      "disabled": false,
      "trackDataQueue": this.$store.state.rooms.currentQueue,
      "trackDataHistory": this.$store.state.rooms.history
    }
  },
  computed: {
    queueAlbumImages: function() {
      const items = this.$store.state.rooms.currentQueue;
      const images = items.map(current => current.trackAlbumImage[0].url);

      return images
    }, 
    historyAlbumImages: function() {
      const items = this.$store.state.rooms.history;
      const images = items.map(current => current.trackAlbumImage[0].url);

      return images.reverse().filter((curr, index) => index <= 4);
    }
  }
}
</script>

<style lang="scss">
#trackslider_container {
  .row {
    margin-bottom: 10px;
    padding: 0px 15px 0px 15px;
  }
  .album_cover {
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: 2px solid black;
    width: 150px;
    height: 150px;
    margin-right: 50px;
    box-shadow: -7px 7px 0px -1px rgba(0, 0, 0, 0.75);
    background-size: cover;

    h3 {
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: bold;
      font-size: 1.3rem;
      text-shadow: 1px 1px 3px black;
    }

    h4 {
      @extend h3;
      font-size: 0.6rem;
    }
  }

  .cv-tab.bx--tabs {
    font-family: 'IBM Plex Sans', sans-serif;
    margin-bottom: 15px;
  }

  .cv-tabs-button {
    font-size: 1.2rem;
  }

  .bx--tabs__nav {
    border: 1px solid black;
    box-shadow: -7px 7px 0px -1px rgba(0, 0, 0, 0.75);
  }

  .bx--tabs__nav-item--selected > a {
    font-size: 1.3rem !important;
  }

  .cv-tabs__panels {
    min-height: 180px;
  }
}
</style>
