export const grabGenre = (state) => (type) => {
    return type.length > 0 ? state.genres.filter(currentGenre => currentGenre.toLowerCase().indexOf(type) === 0) : state.genres;
}

export const grabNotifications = (state) => {
    return state.notification;
}

export const grabDarkMode = (state) => {
    return state.darkMode === 'true' ? true : false;
}

export const grabDevices = (state) => {
    return state.spotifyAPIData.devices;
}