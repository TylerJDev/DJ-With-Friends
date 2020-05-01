<template>
  <div id="slider_item_container">
    <div v-for="(item, index) in itemArr" :key="'album_item_' + index" class="album_cover">
      <img class="album_" :src="item" alt="" :style="[show.indexOf('item_' + itemType + '_' + index) >= 0 === true ? {'filter': 'brightness(50%)'} : '']"/>
      <button :aria-expanded="show.indexOf('item_queue_' + index) >= 0 ? 'true' : 'false'" :id="'item_accordion_trigger-' + index" class="details_accordion" v-on:click="showDetails">
        <span class="sr_hide" v-if="show.indexOf('item_queue_' + index) === -1">Show Details</span>
        <span class="sr_hide" v-if="show.indexOf('item_queue_' + index) >= 0">Hide Details</span>
        <ExpandCategories v-if="show.indexOf('item_queue_' + index) === -1" />
        <Close16 v-if="show.indexOf('item_queue_' + index) >= 0" />
      </button>
      <div class="track_details" v-if="slideItems.length && show.indexOf('item_' + itemType + '_' + index)  >= 0" :id="'item_' + itemType + '_' + index">
        <h3>{{slideItems[index].trackName.substring(0, 30)}} <span v-if="slideItems[index].trackName.length > 30">...</span></h3>
        <div class="meta">
          <h4>{{slideItems[index].trackAlbum}} <span v-if="slideItems[index].trackAlbum.length > 30">...</span></h4>
        </div>
        <a target="_blank" :href="'https://open.spotify.com/track/' + slideItems[index].trackURI.split('track:')[1]"  class="view_on">View on Spotify</a> 
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemArr: {
      type: Array,
      required: true
    },
    itemType: {
      type: String,
      required: true
    },
    slideItems: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      show: [],
    }
  },
  methods: {
    showDetails: function(e) {
      const target =  e.target.getAttribute('id') !== null ? e.target.getAttribute('id').split('-')[1] : '';

      if (target.length) {
        if (this.show.indexOf('item_' + this.itemType + '_' + target) >= 0) {
          let currentIndex = this.show.indexOf('item_queue_' + target);
          this.show.splice(currentIndex, 1);
        } else {
          this.show.push('item_' + this.itemType + '_' + target);
        }
      }
    }
  },
  beforeUpdate() {
    console.log('beforeUpdate', `Length: ${this.itemArr.length}`)
  },
  updated() {
    // Ensure when updated show array is cleared
    // This is so that any item which is currently expanded
    // Does not carry that state for the new item which is added for index - x
    // if (this.show.length) {
    //   this.show = [];
    // }
    console.log('updated', `Length: ${this.itemArr.length}`);
  }
}
</script>

<style lang="scss" scoped>
  #slider_item_container {
    display: flex;
  }
</style>