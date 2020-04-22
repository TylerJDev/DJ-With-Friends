const LobbyStore = {
  state: {
    allRooms: [],
    rooms: [],
    page: [1],
    maxPages: 1,
    currentDisplayed: {},
    filtered: 'oldest',
    genre: '',
    userLimit: [],
    userCount: '',
  },
  mutations: {
    changeCurrentPage(state, currentPage) {
      state.page.shift();
      state.page.push(currentPage.page);
    },
    addToRooms(state, payload) {
      state.rooms.splice(0, state.rooms.length);
      state.allRooms.splice(0, state.allRooms.length);

      if (payload.length >= 1) {
        payload.forEach((curr) => {
          state.rooms.push(curr);
          state.allRooms.push(curr);
        });
      }
    },
    setCurrentDisplayed(state, payload) {
      if (payload.hasOwnProperty('settings')) {
        state.currentDisplayed = payload;
      } else {
        state.currentDisplayed = {};
      }
    },
    setResultsByTime(state, payload) {
      if (payload.time === 'newest' && state.filtered === 'oldest') {
        state.filtered = 'newest';
        state.rooms.reverse();
      } else if (payload.time === 'oldest' && state.filtered === 'newest') {
        state.filtered = 'oldest';
        state.rooms.reverse();
      }
    },
    setResultsByGenre(state, payload) {
      if (payload.hasOwnProperty('genres')) {
        if (!payload.genres.length) {
          state.rooms = state.allRooms;
          state.genre = payload.genres;
        } else {
          const newResults = [];
          state.genre = payload.genres;
          payload.genres.forEach((current) => {
            const result = state.allRooms.filter((curr) => curr.settings['room-genre'].toLowerCase() === current.toLowerCase());
            if (result.length) {
              newResults.push(...result);
            }
          });

          state.rooms = newResults;
        }
      }
    },
    setResultsByUsers(state, payload) {
      if (payload.hasOwnProperty('users')) {
        if (!payload.users.length) {
          if (state.genre.length) {
            state.rooms = payload.users;
          } else {
            state.rooms = state.allRooms;
          }
          state.userLimit = payload.users;
          state.userCount = payload.count;
        } else {
          state.rooms = payload.users;
          state.userLimit = payload.users;
          state.userCount = payload.count;
        }
      }
    },
  },
  getters: {
    grabPages: (state) => ({ roomsArr = [], totalPages = false, genre = '' }) => {
      const roomsCurrent = !roomsArr.length ? state.rooms : roomsArr;

      // [0] = The total amount of pages within the set limit (4), [1] = The total amount of pages within the set genre
      const returnValues = [roomsCurrent.filter((current, index) => index >= ((state.page - 1) * 4) && index < (state.page * 4)), state.rooms.filter((curr) => curr.settings['room-genre'].includes(genre))];

      return !totalPages ? returnValues[0] : returnValues[1];
    },
    grabGenres: (state, getters) => (targetGenre) => getters.grabPages(state.rooms.filter((curr) => curr.settings['room-genre'].includes(targetGenre))),
    grabCurrentDisplayed: (state) => state.currentDisplayed,
    grabAllPages: (state) => state.rooms,
  },
};

export default LobbyStore;
