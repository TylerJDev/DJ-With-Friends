<template>
  <div class="Callback">
    <h1>Callback!</h1>
  </div>
</template>

<script>
export default {
  name: 'login',
  beforeCreate() {
    var urlParams = new URLSearchParams(window.location.search);
    
    // Check if error
    const ERROR = urlParams.get('error');

    if (ERROR) {
      console.log(`Error! Could not handle callback @${ERROR}`);
      // Return back to login

      // #TO-DO, set a warning so user knows WHY they were redirected
      this.$router.push('login');
    } else {
      // Grab returned code
      const SPOTIFY_CODE = urlParams.get('code');
      const SPOTIFY_STATE = urlParams.get('state');

      // Save code & state to localStorage
      localStorage.setItem('auth_code', SPOTIFY_CODE);
      localStorage.setItem('spotify_state', SPOTIFY_STATE);

      // Push to state
      this.$store.commit('addSpotifyAPIData', {
        authCode: SPOTIFY_CODE,
        spotifyState: SPOTIFY_STATE
      });

      // Handle Auth Flow
      const data = {'auth_code': SPOTIFY_CODE, 'auth_state': SPOTIFY_STATE};

      // #TO-DO, if rejected?
      fetch('http://localhost:3000/callback', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(res => {
        // Grab returned access_token && refresh_token
        const ACCESS_TOKEN = res.access_token;
        const REFRESH_TOKEN = res.refresh_token;
        const USER = res.display_name;
        const EXPIRES = {'expiresWhen': res.expires_in, 'timestamp': Math.round(new Date().getTime() / 1000)};

        console.log(EXPIRES);

        // Save access & refresh to localStorage
        localStorage.setItem('access_token', ACCESS_TOKEN);
        localStorage.setItem('refresh_token', REFRESH_TOKEN);
        localStorage.setItem('user', USER);
        localStorage.setItem('expires', JSON.stringify(EXPIRES));

        this.$store.commit('addSpotifyAPIData', {
          accessToken: ACCESS_TOKEN,
          refreshToken: REFRESH_TOKEN,
          user: USER,
          expiresIn: EXPIRES
        });

        // Set isLoggedIn state to true
        this.$store.commit('checkLoggedIn', {status: true});
        this.$router.push('/'); // Go to homepage
      });
    }
  }
}
</script>
