import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

export const checkLoggedIn = (state, payload) => {
  state.isLoggedIn = payload.status;
};

export const addSpotifyAPIData = (state, payload) => {
  const payloadData = Object.keys(payload);
  payloadData.forEach((curr, index) => {
    if (state.spotifyAPIData[curr] !== undefined) {
      console.log(`Key: ${curr} assigned, Value:${Object.values(payload)[index]}`); // eslint-disable-line
      state.spotifyAPIData[curr] = Object.values(payload)[index];
    }
  });
};

export const errorHandle = (state, payload) => {
  state.errorOccurred = payload;
};

export const notificationHandle = (state, payload) => {
  Vue.set(state.notification, Object.assign(state.notification, payload));
};

export const darkMode = (state, payload) => {
  if (payload.hasOwnProperty('mode') && typeof payload.mode === 'boolean') {
    state.darkMode = payload.mode;
    localStorage.setItem('dark_mode', state.darkMode);
  }
};

export const hostMode = (state, payload) => {
  if (payload.hasOwnProperty('mode') && typeof payload.mode === 'boolean') {
    state.hostMode = payload.mode;
    localStorage.setItem('host_mode', state.hostMode);
  }
};

/**
 * Send message to notification panel in navbar.
 * @param {object} state - The state 
 * @param {object} payload - Information about the message
 * @param {string} payload.type - "Type" of information, values being "success", "info"
 * @param {boolean} payload.initialised -  If active, placeholder prop
 * @param {string} payload.message - Short description about notification
 * @param {string} payload.name - Name of the notification
 * @param {number} payload.timeJoined - Time notification sent, in epoch format (i.e, miliseconds)
 */
export const notifyUsers = (state, payload) => {
  state.notificationList.unshift(payload);
  state.activeNotify = true;
  state.activeNotifyCount += 1;
};

export const clearNotifications = (state) => {
  state.notificationList = [];
};

export const loadingState = (state, payload) => {
  if (Object.prototype.hasOwnProperty.call(payload, 'status') && typeof payload.status === 'boolean') {
    state.loading = payload.status;
  }
};

export const addTopTrackData = (state, payload) => {
  state.spotifyAPIData.topTrackData = payload;
};

export const addFirebaseData = (state, payload) => {
  const userFire = {};
  // Check current state of user via firebase
  // const user = Firebase.auth().currentUser;

  firebase.auth().onAuthStateChanged((user) => {
    let payloadData;
    if (user) {
      if (user.displayName !== null && user.displayName !== undefined) {
        userFire.user = user.displayName;
        userFire.email = user.email;
      }
      userFire.uid = user.uid;
      userFire.firebaseActive = user.isAnonymous === true ? 'guest' : true; 
    }

    if (payload === false) {
      payloadData = Object.keys(userFire);
      payload = userFire;
    }

    if (payloadData !== undefined) {
      payloadData.forEach((curr, index) => {
        if (state.spotifyAPIData[curr] !== undefined) {
          console.log(`Key: ${curr} assigned, Value:${Object.values(payload)[index]}`); // eslint-disable-line
          state.spotifyAPIData[curr] = Object.values(payload)[index];
        }
      });
    }
  });
};

/**
 * Add activeNotify state, which determines if there are new notification(s)
 * @param {object} payload - Information about state of notification(s)
 * @param {boolean} payload.notifyState - If there are new notification(s), truthy/falsy
 */
export const modifyNotifyActiveState = (state, payload) => {
  state.activeNotify = payload.notifyState;

  if (!payload.notifyState) {
    state.activeNotifyCount = 0;
  }
};
