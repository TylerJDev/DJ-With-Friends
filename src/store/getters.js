export const grabGenre = (state) => (type) => (type.length > 0 ? state.genres.filter((currentGenre) => currentGenre.toLowerCase().indexOf(type) === 0) : state.genres);

export const grabNotifications = (state) => state.notification;

export const grabDarkMode = (state) => (state.darkMode === 'true');

export const grabDevices = (state) => state.spotifyAPIData.devices;

export const grabNavNotifications = (state) => state.notificationList;

export const timeAgo = (state) => {
  const items = state.notificationList.map((current) => Math.floor((Date.now() - current.timeJoined) / 1000));

  items.forEach((item, index) => {
    let itemTitle = '';

    if (item !== false) {
      if (item < 60) {
        itemTitle = 'A few seconds ago';
      } else if (item > 60 && item < 600) {
        itemTitle = 'A few minutes ago';
      } else {
        itemTitle = `${Math.floor(item / 60)} minutes ago`;
      }
    }
    items[index] = itemTitle;
  });

  return items;
};

export const errorAtStore = (state) => state.errorToStore;
