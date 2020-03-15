<template>
<div>
  <nav aria-label="Pagination" id="pagination_navigation"> <!-- Asscoiate label with navigation region -->
      <ul>
        <li>
          <a href="#" aria-describedby="pagination_navigation" id="prev_control" class="pagination_controls" v-on:click="paginationControl" v-if="pages != 1"><i class="fas fa-chevron-left"></i>Previous</a>
        </li>
        <li v-for="(item, index) in allPages" :key="'current_page_' + index">
          <a href="#" v-on:click="switchPage" :class="(index + 1) == pages ? 'current_page pagination_link' : 'pagination_link'" aria-describedby="pagination_navigation" :aria-current="(index + 1) == pages ? 'page' : false">{{index + 1}}</a> <!-- SR: 1, Pagination-->
        </li>
        <li>
          <a href="#" aria-describedby="pagination_navigation" id="next_control" class="pagination_controls" v-on:click="paginationControl" v-if="pages != this.allPages.length">Next<i class="fas fa-chevron-right"></i></a>
        </li>
      </ul>
  </nav>

  <footer>
    <div id="footer_links">
      <a href="/about">About</a>
      <a href="/">Need Help?</a>
      <span>Version 0.0.1</span>
    </div>
  </footer>
  </div>
</template>

<script>
import * as elemFocus from '@/utils/focus.js';
export default {
  name: 'LobbyFooter',
  props: {
    totalPages: Array
  },
  data()  {
    return {
      pages: this.$store.state.lobby.page
    }
  },
  computed: {
    allPages() {
      return new Array(Math.ceil(this.totalPages.length / 4)).fill(0);
    }
  },
  methods: {
    switchPage(e) {
      this.$store.commit('changeCurrentPage', {page: parseInt(e.target.textContent)});
    },
    paginationControl(e) {
      let currentPage = parseInt(this.pages);
      const setPageTo = e.target.textContent === 'Next' ? (currentPage + 1) : (currentPage - 1);
      
      if (setPageTo !== 0 && setPageTo <= this.allPages.length) {
        this.$store.commit('changeCurrentPage', {page: setPageTo});
        elemFocus.focusEle(['a.room_link', '#modal_create_room']);
      }
    }
  },
  mounted() {
    this.$store.state.lobby.maxPages = new Array(Math.ceil(this.$store.state.lobby.rooms.length / 4)).fill(0);
  }
}

</script>

<style lang="scss" scoped>
  .current_page {
    color: black;
    text-decoration: underline;
  }

  #pagination_navigation {
    text-align: right;
    
    ul {
      list-style-type: none;
      li {
        display: inline-block;
        margin: 10px;
      }
      a {
        color: black;
      }
    }

    .fas {
      margin: 8px;
    }
  }

  #footer_links {
    bottom: 0;
    a {
      margin: 10px;
      @include help_link;
    }
  }
</style>