import Vue from 'vue'
import Vuex from 'vuex'
import userListStore from './components/store/store.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    a: userListStore
  },
  state: {
    isLoggedIn: false,
    spotifyAPIData: {
      'authCode': localStorage.getItem('auth_code'),
      'spotifyState': localStorage.getItem('spotify_state'),
      'accessToken': localStorage.getItem('access_token'),
      'refreshToken': localStorage.getItem('refresh_token'),
      'user': localStorage.getItem('user'),
      'expiresIn': localStorage.getItem('expires'),
      'userID': localStorage.getItem('userID'),
      'devices': localStorage.getItem('devices'),
    },
    roomID: ''
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
    async auth ({commit, state}, payload) {
      const urlParams = payload.urlCurrent !== undefined ? new URLSearchParams(payload.urlCurrent) : false;
      const refreshToken = payload.refresh !== undefined ? payload.refresh : false;
      const callAPI = payload.callToAPI;

      let returnTo = {redirect: payload.callbackURL};

      // Check if error
      const ERROR = urlParams !== false ? urlParams.get('error') : false;

      if (ERROR) {
        console.log(`Error! Could not handle callback @${ERROR}`);
        // Return back to login || other path
        returnTo.redirect = '/login'

        // #TO-DO, set a warning so user knows WHY they were redirected
        return returnTo;
      } else {
        let SPOTIFY_CODE;
        let SPOTIFY_STATE;
        let REFRESH_TOKEN;
        let USER;
        let ID;
        let DEVICES;

        if (urlParams !== false) {
          // Grab returned code
          SPOTIFY_CODE = urlParams.get('code');
          SPOTIFY_STATE = urlParams.get('state');

          // Save code & state to localStorage
          localStorage.setItem('auth_code', SPOTIFY_CODE);
          localStorage.setItem('spotify_state', SPOTIFY_STATE);

          // Push to state
          commit('addSpotifyAPIData', {
            authCode: SPOTIFY_CODE,
            spotifyState: SPOTIFY_STATE
          });
        }

        // Handle Auth Flow
        const data = refreshToken === false ? {'auth_code': SPOTIFY_CODE, 'auth_state': SPOTIFY_STATE} : {'refresh_token': refreshToken};

        let response = await fetch(`http://localhost:3000/${callAPI}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        let res = await response.json();

        const ACCESS_TOKEN = res.access_token;
        const EXPIRES = {'expiresWhen': res.expires_in, 'timestamp': Math.round(new Date().getTime() / 1000)};

        // Save access & refresh to localStorage
        localStorage.setItem('access_token', ACCESS_TOKEN);
        localStorage.setItem('expires', JSON.stringify(EXPIRES));

        if (refreshToken === false) {
          REFRESH_TOKEN = res.refresh_token;
          USER = res.display_name;
          ID = res.id;
          DEVICES = JSON.stringify(res.devices);

          localStorage.setItem('refresh_token', REFRESH_TOKEN);
          localStorage.setItem('user', USER);
          localStorage.setItem('userID', ID);
          localStorage.setItem('devices', DEVICES);
        }

        commit('addSpotifyAPIData', {
          accessToken: ACCESS_TOKEN,
          refreshToken: refreshToken === false ? REFRESH_TOKEN : state.spotifyAPIData.refreshToken,
          user: refreshToken === false ? USER : state.spotifyAPIData.user,
          expiresIn: EXPIRES,
          userID: refreshToken === false ? ID : state.spotifyAPIData.userID,
          devices: refreshToken === false ? DEVICES : state.spotifyAPIData.devices,
        });

        // Set isLoggedIn state to true
        commit('checkLoggedIn', {status: true});
        return returnTo;
      }
    }
  }
})
