const LobbyStore = {
    state: {
        rooms: [],
        page: 1
    },
    mutations: {

    },
    getters: {                
        grabPages: (state) => { 
            return state.rooms.filter((current, index) => index >= ((state.page - 1) * 4) && index < (state.page * 4));
        }
    }, 
    actions: {
        
    }
}

export default LobbyStore;