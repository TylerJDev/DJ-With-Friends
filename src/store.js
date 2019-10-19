import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    spotifyAPIData: {
      'authCode': localStorage.getItem('auth_code'),
      'spotifyState': localStorage.getItem('spotify_state'),
      'accessToken': localStorage.getItem('access_token'),
      'refreshToken': localStorage.getItem('refresh_token'),
      'user': localStorage.getItem('user'),
      'expiresIn': localStorage.getItem('expires')
    }
  },
  mutations: {
    checkLoggedIn(state, payload) {
      state.isLoggedIn = payload.status;
    },
    addSpotifyAPIData(state, payload) {
      let payloadData = Object.keys(payload);
      payloadData.forEach((curr, index) => {
        if (state.spotifyAPIData[curr] !== undefined) {
          console.log(`Key: ${curr} assigned, Value:${Object.values(payload)[index]}`);
          state.spotifyAPIData[curr] = Object.values(payload)[index];
        }
      });
    }
  },
  actions: {
    async auth ({commit, state}, currentLink) {
      const urlParams = new URLSearchParams(window.location.search);

      // Check if error
      const ERROR = urlParams.get('error');

      const data = {'auth_code': 'Testing1', 'auth_state': 'Testing2'};

      let response = await fetch('http://localhost:3000/test', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      let returnedData = await response.json();
      console.log(returnedData);

    }
  }
})
