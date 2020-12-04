<template>
  <div id="room_list">
    <div id="sort_by_container">
      <cv-multi-select theme="light" id="select_genre" aria-label="Genre" label="Genre" @change="genreChange" :options="getAllGenres" :inline="true" :filterable="true" :auto-filter="true" :auto-highlight="true"></cv-multi-select>
      <cv-multi-select label="Users" aria-label="Users" @change="userLimitChange" :options="sortByUsers" :inline="true" :filterable="false" :auto-filter="true" :auto-highlight="true"></cv-multi-select>            
      
      <div class="bx--select-input__wrapper">
        <select
          @change="sortByChange"
          class="bx--select-input"
          id="sort_by_select">
            <option value="">Sort By</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
    </div>

    <div id="room_select_container">
      <RoomCard v-for="(item, index) in roomResults" :rooms="item" :key="'room_item' + index" @show-details="showDetails"/>
    </div>

    <div id="room_pagination">
      <cv-pagination
        page-number-label="Page number"
        page-sizes-label="Items per page:"
        :number-of-items="numberOfItems.length"
        :page="page"
        :page-sizes="pageSizes"
        @change="onPageChange"></cv-pagination>
    </div>
  </div>
</template>

<script>
import RoomCard from "@/pages/LobbyRoomPage/RoomCard.vue";
import { focusEle } from '@/utils/focus.js';

export default {
  name: "RoomSelect", 
  data() {
    return {
      roomResults: this.initialRoomResults, //this.currentRoomResults,
      filter: "All",
      activeModal: false,
      rooms: this.$store.state.lobby.rooms,
      totalPages: this.$store.state.lobby.rooms,
      page: Number(this.$store.state.lobby.page[0]),
      genreDisabledSelect: false,
      usersDisabledSelect: false,
      pageSizes: [10, { "value": 4, "selected": true }, 30, 40, 50],
      users: [[1, 4], [5, 9], [10, 14], [15]],
      sortBy: ['Newest', 'Oldest'],
      numberOfItems: this.$store.state.lobby.rooms,
      filterTime: ''
    };
  },
  watch: {
    rooms: function() {
      this.filterBy(this.filter);
    },
    page: function() {
      this.changePage();
    }
  },
  computed: {
    getAllGenres: function() {
        return this.$store.state.genres.map(item => {
        const nameVal = item.replace(/\W/, '_').toLowerCase();
        return {
          name: nameVal,
          label: item,
          value: nameVal,
        };
      });
    },
    initialRoomResults: function() {
      return this.$store.state.lobby.rooms;
    },
    sortByUsers: function() {
      return this.users.map(item => {
        let currentVal = item.join(' - ');
        if (item.length === 1) {
          currentVal += '+';
        }

        return {
          name: currentVal,
          label: currentVal,
          value: currentVal,
        };
      });
    },
    sortByType: function() {
      return this.sortBy.map(item => {
        const nameVal = item.replace(/\W/, '_').toLowerCase();
        return {
          name: nameVal,
          label: item,
          value: nameVal,
        };
      });
    }
  },
  methods: {
    grabUsers: function(idx) {
      if (this.$store.getters.grabPages({})[idx] !== undefined)
        return this.$store.getters.grabPages({})[idx].users;
    },
    changePage: function() {
      this.roomResults = this.$store.getters.grabGenres(
        this.filter === "All" ? "" : this.filter
      );
    },
    filterBy: function(e = "All") {
      const targetGenre = typeof e === "string" ? e : e.target.textContent;
      this.filter = targetGenre;

      this.totalPages = this.$store.getters.grabPages(
        [],
        true,
        this.filter === "All" ? "" : this.filter
      );

      // Return to first page
      if (this.page != 1) {
        this.$store.commit("changeCurrentPage", { page: 1 });
      }

      if (targetGenre === "All") {
        this.roomResults = this.$store.getters.grabPages({});
        return true;
      }
      this.roomResults = this.$store.getters.grabGenres(targetGenre);
    },
    genreChange: function(e, failsafe=false) {
      const genreVal = e.map(c => c.replace(/_/g, ' '));
      let filteredRooms = this.$store.getters.grabPages({totalPages: true}).filter((current) => {
        let filtered = false;
        genreVal.forEach((curr) => {
          if (current.settings['room-genre'].toLowerCase() === curr) {
            filtered = true;
          }
        });

        if (filtered) {
          return current;
        }
      }); 
      
      if (!filteredRooms.length && !e.length || e.indexOf('all') >= 0) {
        this.$store.commit('setResultsByGenre', {'genres': []});
        if (this.$store.state.lobby.userCount.length && failsafe === false) {
          this.userLimitChange(this.$store.state.lobby.userCount);
        }

        this.roomResults = this.$store.getters.grabPages({});
        this.numberOfItems = this.$store.getters.grabPages({totalPages: true});
      } else {
        this.$store.commit('setResultsByGenre', {'genres': genreVal});
        this.roomResults = this.$store.getters.grabPages({roomsArr: filteredRooms});
        this.numberOfItems = this.$store.getters.grabPages({roomsArr: filteredRooms, totalPages: true});
      }
    },
    userLimitChange: function(e) {
      let filteredUserLimit = this.$store.getters.grabPages({totalPages: true}).filter((current => {
        let filtered = false;
        e.forEach((curr) => {
          let currentNum = curr.split(' - ').map(current => parseInt(current));

          if ((currentNum.length === 1 && current.users.length >= currentNum[0]) || (currentNum.length !== 0 && current.users.length >= currentNum[0] && current.users.length <= currentNum[1])) {
            filtered = true;
          }
        });

        if (filtered) {
          return current;
        }
      }));

      if (!filteredUserLimit.length && !e.length) {
        this.$store.commit('setResultsByUsers', {'users': [], 'count': e});

        if (this.$store.state.lobby.genre.length) {
          this.genreChange(this.$store.state.lobby.genre, true);
        }

        this.roomResults = this.$store.getters.grabPages({});
        this.numberOfItems = this.$store.getters.grabPages({totalPages: true});
      } else {
        if (!filteredUserLimit.length && this.$store.state.lobby.genre.length) {
          this.genreChange(this.$store.state.lobby.genre, true);
          // filteredUserLimit = this.$store.getters.grabPages({totalPages: true});
        }

        this.$store.commit('setResultsByUsers', {'users': filteredUserLimit, 'count': e});
        this.roomResults = this.$store.getters.grabPages({roomsArr: filteredUserLimit});
        this.numberOfItems = this.$store.getters.grabPages({roomsArr: filteredUserLimit, totalPages: true});
      }
    },
    sortByChange: function(sort) {
      switch(sort.target.value) { 
        case 'oldest':
          this.$store.commit('setResultsByTime', {'time': 'oldest'});
          this.roomResults = this.$store.getters.grabPages({});
          break;
        case 'newest':
          this.$store.commit('setResultsByTime', {'time': 'newest'});
          this.roomResults = this.$store.getters.grabPages({});
          this.numberOfItems = this.$store.getters.grabPages({totalPages: true});
          break;
        default:
          this.roomResults = this.$store.getters.grabPages({});
          break;
      }
    },
    onPageChange: function(e) {
      this.$store.commit('changeCurrentPage', {'page': e.page});
      this.changePage();

      let toFocus = this.$el.querySelectorAll('#room_select_container a').length ? this.$el.querySelectorAll('#room_select_container a') :
      this.$el.querySelectorAll('[tabindex="0"], button, a, select, input');

      focusEle(toFocus);
    },
    showDetails: function(type) {
      this.$emit('show-details', type);
    }
  },
  mounted() {
    const inputElem = this.$el.querySelector('div[role="listbox"] input.bx--text-input');

    if (inputElem !== null) {
      inputElem.setAttribute('aria-label', 'Genre');

      // Assume that select is also present
      this.$el.querySelector('#sort_by_select').setAttribute('aria-label', 'Select');
    }
  },
  components: {
    RoomCard,
  }
};
</script>

<style lang="scss">
  @media (max-width: 66rem) {
    #sort_by_container {
      flex-direction: column;
      > div {
        width: 100%;
        display: block;
        border-bottom: 1px solid black;
        margin-bottom: 5px;
        input, select, #select_genre, .bx--list-box__menu {
          width: 100%;
          padding-left: 0px;
          border: none;
        }

        select {
          padding-left: 8px;
          background-color: transparent;
        }
      }
    }
  }  

  #room_list {
    height: 300px;
  }

  #sort_by_container {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .bx--select-input {
      height: 2.01rem;
      background-color: transparent;
    }

    .bx--list-box.bx--list-box--inline {
      background-color: transparent;
    }

    #select_genre {
      width: 200px;
    }
    .bx--list-box__menu {
      width: 300px;
    }
    .bx--text-input {
      padding-right: 0px !important;
    }
    :last-child {
      line-height: 1.65rem;
    }

    #sort_by_select {
      height: 40px;
      margin-bottom: 3px ;
    }
  }

  #room_select_container {
    min-height: 240px !important;
  }

  #room_pagination {
    margin-top: 20px;
    .bx--pagination {
      background-color: transparent;
      border: 1px solid black;
    }

    .bx--pagination__button:first-of-type {
      border-right: 1px solid black;
      border-left: 1px solid black;
    }

    .cv-pagination {
      width: 50%;
      float: right;
      .bx--select__item-count, .bx--select-input--inline__wrapper, .bx--select__page-number ~ .bx--pagination__text {
        display: none !important;
      }
    }
  }
</style>