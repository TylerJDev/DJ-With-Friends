<template>
  <div id="trackslider_container">
    <div class="container">      
      <cv-tabs :container="container" aria-label="navigation tab label">
        <cv-tab label="Queue">
          <div class="row">
            <button v-if="sliderIndex !== 0 && this.$store.state.rooms.currentQueue.length" id="slider_previous" class="slider_btn" aria-label="Previous" v-on:click="slideActivate"><ArrowLeft/></button>
            <SliderItem :itemArr="queueAlbumImages" itemType="queue" :slideItems="queueItems" />
            <button v-if="sliderIndex + 4 < this.$store.state.rooms.currentQueue.length && this.$store.state.rooms.currentQueue.length" id="slider_next" class="slider_btn" aria-label="Next" v-on:click="slideActivate"><ArrowRight/></button>
          </div>
          
        </cv-tab>

        <cv-tab label="History">
            <div class="row">
              <button v-if="sliderHistoryIndex !== 0 && this.$store.state.rooms.history.length" id="slider_history_previous" class="slider_btn" aria-label="Previous" v-on:click="slideActivate"><ArrowLeft/></button>
              <SliderItem :itemArr="historyAlbumImages" itemType="history" :slideItems="historyItems" />
              <button v-if="sliderHistoryIndex + 4 < this.$store.state.rooms.history.length && this.$store.state.rooms.history.length" id="slider_history_next" class="slider_btn" aria-label="Next" v-on:click="slideActivate"><ArrowRight/></button>
          </div>
        </cv-tab>
      </cv-tabs>
    </div>
  </div>
</template>

<script>
import SliderItem from '@/pages/UserRoomsPage/SliderItem.vue';

export default {
  data() {
    return {
      container: false,
      selected: false,
      disabled: false,
      trackDataQueue: this.$store.state.rooms.currentQueue,
      show: [],
      sliderIndex: 0,
      sliderHistoryIndex: 0,
    }
  },
  methods: {
    showDetails: function(e) {
      const target =  e.target.getAttribute('id') !== null ? e.target.getAttribute('id').split('-')[1] : '';

      if (target.length) {
        if (this.show.indexOf('item_queue_' + target) >= 0) {
          let currentIndex = this.show.indexOf('item_queue_' + target);
          this.show.splice(currentIndex, 1);
        } else {
          this.show.push('item_queue_' + target);
        }
      }
    },
    slideActivate: function(e) {
      const targetID = e.target.getAttribute('id');
      const queueLength = this.$store.state.rooms.currentQueue.length;
      const queueHistoryLength = this.$store.state.rooms.history.length;

      if (typeof targetID === 'string') {
        switch(targetID) {
          case 'slider_next':
            if (this.sliderIndex + 4 < queueLength) {
              this.sliderIndex++;
              this.$store.commit('setIndex', {index: this.sliderIndex, type: 'queue'})
            } 
            break;
          case 'slider_previous':
            if (this.sliderIndex > 0) {
              this.sliderIndex--;
              this.$store.commit('setIndex', {index: this.sliderIndex, type: 'queue'})
            } 
            break;
          case 'slider_history_next': 
            if (this.sliderHistoryIndex + 4 < queueHistoryLength) {
              this.sliderHistoryIndex++;
              this.$store.commit('setIndex', {index: this.sliderHistoryIndex, type: 'history'});
            }
            break;
          case 'slider_history_previous': 
            if (this.sliderHistoryIndex > 0) {
              this.sliderHistoryIndex--;
              this.$store.commit('setIndex', {index: this.sliderHistoryIndex, type: 'history'})
            }
            break;
          default: 
            console.error('Could not get type ' + targetID);
        }
      }
    }
  },
  computed: {
    queueAlbumImages: function() {
      const items = this.$store.state.rooms.sliderQueue;
      const images = items.map(current => current.albumImage[0].url);

      return images.filter((curr, index) => index <= 4);
    }, 
    historyAlbumImages: function() {
      const items = this.$store.state.rooms.history;
      const images = items.map(current => current.albumImage[0].url);

      return images.reverse().filter((curr, index) => index <= 4);
    },
    historyItems: function() {
      return this.$store.state.rooms.history.reverse();
    },
    queueItems: function() {
      return this.$store.state.rooms.currentQueue;
    }
  },
  components: {
    SliderItem
  }
}
</script>

<style lang="scss">
#trackslider_container {
  .row {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    padding: 0px 15px 0px 15px;
    flex-wrap: nowrap;

    .slider_btn {
      width: 60px;
      box-shadow: 2px 3px 0px 2px rgba(0, 0, 0, 0.75) !important;
      border: 1px solid black;
      background-color: transparent;
      > svg {
        pointer-events: none;
      }
    }
  }
  .album_cover {
    display: flex;
    flex-direction: column;
    border: 2px solid black;
    width: 150px;
    height: 150px;
    margin-right: 25px;
    margin-left: 25px;
    box-shadow: -7px 7px 0px -1px rgba(0, 0, 0, 0.75);
    background-size: cover;
    .details_accordion {
      z-index: 5;
      border: none;
      background-color: black;
      color: white;
      width: 30px;
      height: 21px;
      filter: opacity(90%);
      margin-top: 5px;
      margin-left: 110px;
      position: absolute;
      border-top: 1px solid white;
      border-right: 1px solid white;
      border-bottom: 1px solid white;
      border-left: 1px solid white;
      font-size: 0.8rem;
      display: flex;
      svg {
        fill: white;
        pointer-events: none;
      }
      .sr_hide {
        @include sr_only;
      }
    }

    img {
      position: absolute; 
      height: 150px;
      width: 150px;
      z-index: 1;
    }

    div.track_details {
      z-index: 2;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      overflow: hidden;
    }

    h3 {
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: bold;
      font-size: 0.8rem;
      text-shadow: 1px 1px 3px black;
      color: white;
      z-index: 2;
      margin-top: 20px;
      line-height: 1.3rem;
    }

    h4 {
      @extend h3;
      font-size: 0.6rem;
      margin-top: 0px;
      white-space: pre;
    }

    .view_on {
      @extend h3;
      font-size: 0.8rem
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
