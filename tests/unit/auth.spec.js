import store from '@/store/index.js';

describe('Testing callback and store', () => {
  it('Check redirect upon error in params', () => store.dispatch('auth', { urlCurrent: 'q=query&topic=api&error=true' }).then((res) => {
    expect(res.redirect).toBe('/login');
  }));

  it('Check error upon denying access', () => store.dispatch('auth', { urlCurrent: 'q=query&topic=api&error=true' }).then((res) => {
    expect(store.state.errorOccurred).toMatchObject({ route: '/login', errorType: 'Access Denied' });
  }));

  it('Testing proper store state', () => {
    // Dispatch mock data to store
    const dataObj = {
      urlCurrent: '?code=RsL7gVcTirPEuYt2lBh1Uj78njyhMuWaPsESPcwBSmFhYSd8OyBtzR2EBk51vxwUNyaoAvQ2hUJz5XvjhKhD8vG7Dw9cqblWXPQ&state=Q05AIzk4AV1lktiH',
      callbackURL: '/',
      callToAPI: 'callback',
    };

    const respObj = {
      country: 'US',
      display_name: 'Mr. Mock',
      explicit_content: {
        filter_enabled: false,
        filter_locked: false,
      },
      external_urls: {
        spotify: 'https://open.spotify.com/user/1Q1euW9RdKY6C2TnRkAYtoIif',
      },
      followers: {
        href: null,
        total: 0,
      },
      href: 'https://api.spotify.com/v1/users/1Q1euW9RdKY6C2TnRkAYtoIif',
      id: '1Q1euW9RdKY6C2TnRkAYtoIif',
      images: [],
      product: 'premium',
      type: 'user',
      uri: 'spotify:user:1Q1euW9RdKY6C2TnRkAYtoIif',
      access_token: '61V5m0FPeqKOLv7XuJGVmhAFHt24NVUXzv6yKYF5LqQQ2mTXvfp8SgeYZNSBTmpg881KvrlJkbTxy6o5mdY0MLLlzNISGfU47X7',
      expires_in: 3600,
      refresh_token: 'lnxywiIOtT5bfieInDIA48F2O9JFzUlA4QvUp60XriRMVBtPRcD16emtUtcAjUR4O1bL1BcLg27OXGk6IWh0gcsIJgtmIqS3dj2',
      devices: {
        devices: [
          {
            id: 'ieiy4i9MZ4v5auz8PuNQPQJUb0YwvjIt3U9RkjKE',
            is_active: true,
            is_private_session: false,
            is_restricted: false,
            name: 'DEVICE_1',
            type: 'Computer',
            volume_percent: 50,
          },
        ],
      },
    };

    fetch.mockResponseOnce(JSON.stringify(respObj));

    return store.dispatch('auth', dataObj).then((res) => {
      // Check if user && userID is set
      expect(store.state.spotifyAPIData.user).toBe('Mr. Mock');
      expect(store.state.spotifyAPIData.userID).toBe('1Q1euW9RdKY6C2TnRkAYtoIif');

      // Check if device is set based on name
      expect(JSON.parse(store.state.spotifyAPIData.devices).devices[0].name).toBe('DEVICE_1');

      // Check if user is premium
      expect(store.state.spotifyAPIData.premium).toBeTruthy();

      // Check refresh token is proper
      expect(store.state.spotifyAPIData.refreshToken).toBe('lnxywiIOtT5bfieInDIA48F2O9JFzUlA4QvUp60XriRMVBtPRcD16emtUtcAjUR4O1bL1BcLg27OXGk6IWh0gcsIJgtmIqS3dj2');

      expect(store.state.spotifyAPIData.expiresIn.expiresWhen).toBe(3600);
    });
  });
});
