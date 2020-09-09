import Vue from 'vue';
import Vuex from 'vuex';
import userListStore from '@/store/modules/rooms.js';
import LobbyStore from '@/store/modules/lobby.js';
import * as getters from './getters';
import * as mutations from './mutations';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    lobby: LobbyStore,
    rooms: userListStore,
  },
  state: {
    isLoggedIn: false,
    darkMode: localStorage.getItem('dark_mode') === null ? false : localStorage.getItem('dark_mode') === 'true',
    hostMode: localStorage.getItem('host_mode') === null ? false : localStorage.getItem('host_mode') === 'true',
    spotifyAPIData: {
      authCode: localStorage.getItem('auth_code'),
      spotifyState: localStorage.getItem('spotify_state'),
      accessToken: localStorage.getItem('access_token'),
      refreshToken: localStorage.getItem('refresh_token'),
      user: localStorage.getItem('user'),
      expiresIn: localStorage.getItem('expires'),
      userID: localStorage.getItem('userID'),
      devices: localStorage.getItem('devices'),
      premium: localStorage.getItem('premium'),
      images: localStorage.getItem('images'),
      mainDevice: localStorage.getItem('main_device'),
      topTrackData: localStorage.getItem('topTrackData'),
    },
    roomID: '',
    errorOccurred: false,
    roomKeys: [],
    genres: ['All', 'Musical theatre', 'Popular music', 'Hip hop', 'Jazz', 'Folk music', 'Rock', 'Blues', 'Classical music', 'Country music', 'Heavy metal',
      'Pop music', 'Reggae', 'Rhythm and blues', 'Disco', 'Funk', 'Punk rock', 'Electronic dance music', 'Techno', 'Rap', 'Soul music', 'Alternative rock',
      'Instrumental', 'Singing', 'Dubstep', 'Indie rock', 'Orchestra', 'House music', 'Dance music', 'Gospel music', 'Grunge', 'Trance music', 'Ambient music',
      'Ska', 'Pop rock', 'World music', 'Hardcore punk', 'Easy listening', 'Death metal', 'Folk rock', 'Drum and bass', 'Emo', 'Experimental music', 'New wave',
      'Progressive rock', 'Electro', 'Baroque music', 'Classic rock', 'Dance-pop', 'Opera', 'Breakbeat', 'Trap music',
    ],
    notification: {
      type: 'info',
      title: '',
      subtitle: '',
      actionLabel: '',
      lowContrast: false,
      initialised: false,
    },
    notificationList: [],
    location: window.location.hostname.indexOf('localhost') >= 0 ? 'http://localhost:3000/' : location.hostname.replace('.com', '').split('.').length === 2 ? 'https://dj-with-friends-dev.herokuapp.com/' : 'https://dj-with-friends.herokuapp.com/',
    loading: true,
    roomKey: '',
  },
  mutations,
  getters,
  actions: {
    async auth({
      commit,
      state,
    }, payload) {
      const urlParams = payload.urlCurrent !== undefined ? new URLSearchParams(payload.urlCurrent) : false;
      const refreshToken = payload.refresh !== undefined ? payload.refresh : false;
      const callAPI = payload.callToAPI;

      const returnTo = {
        redirect: payload.callbackURL,
      };

      // Check if error
      const ERROR = urlParams !== false ? urlParams.get('error') : false;

      if (ERROR) {
        // Return back to login || other path
        returnTo.redirect = '/login';

        commit('errorHandle', {
          route: '/login',
          errorType: 'Access Denied',
        });

        // #TO-DO, set a warning so user knows WHY they were redirected
        return returnTo;
      }
      let SPOTIFY_CODE;
      let SPOTIFY_STATE;
      let REFRESH_TOKEN;
      let USER;
      let ID;
      let DEVICES;
      let PREMIUM;
      let IMAGES;
      let MAIN_DEVICE;

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
          spotifyState: SPOTIFY_STATE,
        });
      }

      // Handle Auth Flow
      const data = refreshToken === false ? {
        auth_code: SPOTIFY_CODE,
        auth_state: SPOTIFY_STATE,
      } : {
        refresh_token: refreshToken,
      };

      const response = await fetch(`${state.location}${callAPI}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();

      const ACCESS_TOKEN = res.access_token;
      const EXPIRES = {
        expiresWhen: res.expires_in,
        timestamp: Math.round(new Date().getTime() / 1000),
      };

      // Save access & refresh to localStorage
      localStorage.setItem('access_token', ACCESS_TOKEN);
      localStorage.setItem('expires', JSON.stringify(EXPIRES));

      if (refreshToken === false) {
        REFRESH_TOKEN = res.refresh_token;
        USER = res.display_name;
        ID = res.id;
        DEVICES = JSON.stringify(res.devices);

        if (Object.prototype.hasOwnProperty.call(res.devices, 'devices') === true && res.devices.devices.length > 0) {
          const userCurrentDevice = res.devices.devices.filter((curr) => curr.is_active);
          const userFirstDevice = res.devices.devices[0];

          if (userCurrentDevice.length || (typeof userFirstDevice === 'object' && Object.prototype.hasOwnProperty.call(userFirstDevice, 'id'))) {
            const userMainDevice = userCurrentDevice.length ? userCurrentDevice[0] : userFirstDevice;
            localStorage.setItem('main_device', userMainDevice.id);

            MAIN_DEVICE = userMainDevice.id;
          }
        }

        PREMIUM = res.product === 'premium';
        IMAGES = res.images.length > 0 ? JSON.stringify(res.images) : false;

        localStorage.setItem('refresh_token', REFRESH_TOKEN);
        localStorage.setItem('user', USER);
        localStorage.setItem('userID', ID);
        localStorage.setItem('devices', DEVICES);
        localStorage.setItem('premium', PREMIUM);
        localStorage.setItem('images', IMAGES);
      }

      commit('addSpotifyAPIData', {
        accessToken: ACCESS_TOKEN,
        refreshToken: refreshToken === false ? REFRESH_TOKEN : state.spotifyAPIData.refreshToken,
        user: refreshToken === false ? USER : state.spotifyAPIData.user,
        expiresIn: EXPIRES,
        userID: refreshToken === false ? ID : state.spotifyAPIData.userID,
        devices: refreshToken === false ? DEVICES : state.spotifyAPIData.devices,
        premium: refreshToken === false ? PREMIUM : state.spotifyAPIData.premium,
        images: refreshToken === false ? IMAGES : state.spotifyAPIData.images,
        mainDevice: refreshToken === false ? MAIN_DEVICE : state.spotifyAPIData.mainDevice,
      });

      // Set isLoggedIn state to true
      commit('checkLoggedIn', {
        status: true,
      });
      return returnTo;
    },
    handleNotification({
      state,
      commit,
    }, payload) {
      commit('notificationHandle', payload);
      const time = payload.hasOwnProperty('timeout') === true ? payload.timeout : 5000;
      if (state.notification.initialised) {
        setTimeout(() => {
          commit('notificationHandle', {
            initialised: false,
          });
        }, time);
      }
    },
    async handleReAuth({ state, dispatch }, payload) {
      // Check if access code has expired
      const expiresAt = JSON.parse(localStorage.getItem('expires'));
      // const oldAccessToken = state.spotifyAPIData.accessToken;

      const isExpired = (expiresAt.expiresWhen + expiresAt.timestamp) - Math.floor(new Date().getTime() / 1000);
      if (isExpired < 0 || (Object.prototype.hasOwnProperty.call(payload, 'forceAuth') && payload.forceAuth === true)) {
        console.log('Access token has expired!'); // eslint-disable-line

        // Request a new token
        const { refreshToken } = state.spotifyAPIData;
        if (refreshToken) {
          console.log('Request new token!'); // eslint-disable-line
          return dispatch('auth', { callbackURL: '/', refresh: refreshToken, callToAPI: 'callback' }).then((res) => {
            console.log('Request of new token successful', res); // eslint-disable-line
            // this.$router.push(res.redirect); // Go to homepage

            if (payload !== undefined && payload.refreshFromRooms === true || (Object.prototype.hasOwnProperty.call(payload, 'forceAuth') && payload.forceAuth === true)) {
              return 'done';
            }
          });
        } else {
          // Clear localStorage items
          localStorage.clear();

          // Return to login
          // this.$router.push('/login');
        }
      } else {
        console.log(`Access token expires in ${isExpired}`); // eslint-disable-line
      }
    },
    changeMainDevice({ dispatch }, payload) {
      if (payload.hasOwnProperty('id') && typeof payload.id === 'string') {
        localStorage.setItem('main_device', payload.id);
        dispatch('handleNotification', {
          type: 'success', initialised: true, title: 'Device has changed', subtitle: 'The main device has changed! Playback from that device will start when the next track is played.',
        });
      }
    },
    async specialTrackData({
      commit,
      state,
    }, payload) {
      const callAPI = payload.callToAPI;
      const data = {
        access_token: state.spotifyAPIData.accessToken,
      };

      const response = await fetch(`${state.location}${callAPI}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();
      
      if (Object.prototype.hasOwnProperty.call(res, 'items') && res.items.length >= 1) {
        const trackItems = res.items;

        localStorage.setItem('topTrackData', JSON.stringify(res));
        commit('addTopTrackData', JSON.stringify(res));
      }
    },
  },
});
