<template>
  <div id="slider_item_container">
    <div v-for="(item, index) in itemArr" :key="slideItems[index].keyID" class="album_cover">
      <img class="album_" :src="item" alt="" :style="[show.indexOf('item_' + itemType + '_' + index) >= 0 === true ? {'filter': 'brightness(50%)'} : '']"/>
      <button :aria-expanded="show.indexOf('item_' + itemType + '_' + index) >= 0 ? 'true' : 'false'" :id="'item_accordion_trigger-' + index" class="details_accordion" v-on:click="showDetails">
        <span class="sr_hide" v-if="show.indexOf('item_' + itemType + '_' + index) === -1">Show Details</span>
        <span class="sr_hide" v-if="show.indexOf('item_' + itemType + '_' + index) >= 0">Hide Details</span>
        <ExpandCategories v-if="show.indexOf('item_' + itemType + '_' + index) === -1" />
        <Close16 v-if="show.indexOf('item_' + itemType + '_' + index) >= 0" />
      </button>
      <div class="track_details" v-if="slideItems.length && show.indexOf('item_' + itemType + '_' + index)  >= 0" :id="'item_' + itemType + '_' + index">
        <h3>{{slideItems[index].track.substring(0, 30)}} <span v-if="slideItems[index].track.length > 30">...</span></h3>
        <div class="meta">
          <h4>{{slideItems[index].album}} <span v-if="slideItems[index].album.length > 30">...</span></h4>
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
          let currentIndex = this.show.indexOf('item_' + this.itemType + '_' + target);
          this.show.splice(currentIndex, 1);
        } else {
          this.show.push('item_' + this.itemType + '_' + target);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #slider_item_container {
    display: flex;
  }
</style>