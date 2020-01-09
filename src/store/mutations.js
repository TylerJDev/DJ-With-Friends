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