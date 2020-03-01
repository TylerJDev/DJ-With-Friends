const LobbyStore = {
    state: {
        rooms: [],
        page: [1],
        maxPages: 1
    },
    mutations: {
        changeCurrentPage(state, currentPage) {
            state.page.shift();
            state.page.push(currentPage.page);
        },
        addToRooms(state, payload) {
            if (payload.length >= 1) {
                state.rooms = payload;
            }
        }
    },
    getters: {                
        grabPages: (state) => (roomsArr=[], totalPages=false, genre='') => {
            const roomsCurrent = !roomsArr.length ? state.rooms : roomsArr;

            // [0] = The total amount of pages within the set limit (4), [1] = The total amount of pages within the set genre
            let returnValues = [roomsCurrent.filter((current, index) => index >= ((state.page - 1) * 4) && index < (state.page * 4)), state.rooms.filter(curr => curr.settings['room-genre'].includes(genre))]

            return !totalPages ? returnValues[0] : returnValues[1]; 
        },
        grabGenres: (state, getters) => (targetGenre) => {
            return getters.grabPages(state.rooms.filter(curr => curr.settings['room-genre'].includes(targetGenre)));
        }
    }
}

export default LobbyStore;