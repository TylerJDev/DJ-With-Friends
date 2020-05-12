import Vue from 'vue';

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

export const notifyUsers = (state, payload) => {
  state.notificationList.unshift(payload);
};

export const clearNotifications = (state) => {
  state.notificationList = [];
};

export const loadingState = (state, payload) => {
  if (Object.prototype.hasOwnProperty.call(payload, 'status') && typeof payload.status === 'boolean') {
    state.loading = payload.status;
  }
};
