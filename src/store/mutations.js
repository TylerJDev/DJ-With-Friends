import Vue from 'vue';

export const checkLoggedIn = (state, payload) => {
    state.isLoggedIn = payload.status;
}

export const addSpotifyAPIData = (state, payload) => {
    let payloadData = Object.keys(payload);
    payloadData.forEach((curr, index) => {
        if (state.spotifyAPIData[curr] !== undefined) {
        console.log(`Key: ${curr} assigned, Value:${Object.values(payload)[index]}`); // eslint-disable-line
        state.spotifyAPIData[curr] = Object.values(payload)[index];
        }
    });
}

export const errorHandle = (state, payload) => {
    state.errorOccurred = payload;
}

export const notificationHandle = (state, payload) => {
    Vue.set(state.notification, Object.assign(state.notification, payload));
}

export const darkMode = (state, payload) => {
    if (payload.hasOwnProperty('mode') && typeof payload.mode === 'boolean') {
        state.darkMode = payload.mode;
        localStorage.setItem('dark_mode', state.darkMode);
    }
}