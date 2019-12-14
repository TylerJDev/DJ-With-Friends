<template>
  <div id="app">
    <div id="nav">
    </div>
    <router-view @auth-user="authenticate"/>
  </div>
</template>

<script>
export default {
  methods: {
    authenticate: function() {
      fetch('http://localhost:3000/login', {
        method: 'GET'
      }).then(res => res.text())
      .then(res => {
        if (res.substring(0, 68) === 'https://accounts.spotify.com/authorize?response_type=code&client_id=') {
          window.location = res;
        } else {
          console.log('An error occurred! Could not validate response URL')
        }
      });
    }
  },
  beforeCreate() {
    // Check localStorage for login state
    var authCode = localStorage.getItem('access_token');

    if (authCode === null) {
      console.log('No access_token found!');
    } else {
      // Check if access code has expired
      const expiresAt = JSON.parse(localStorage.getItem('expires'));
      console.log(expiresAt);
      const isExpired = (expiresAt.expiresWhen + expiresAt.timestamp) - Math.floor(new Date().getTime() / 1000);
      if (isExpired < 0) {
        console.log('Access token has expired!');

        // Request a new token
        const refreshToken = this.$store.state.spotifyAPIData.refreshToken
        if (refreshToken) {
          console.log('Request new token!');
          this.$store.dispatch('auth', {callbackURL: '/', refresh: refreshToken, callToAPI: 'callback'}).then(res => {
            console.log('Request of new token successful')
            this.$router.push(res.redirect); // Go to homepage
          });

        } else {
          // Clear localStorage items
          localStorage.clear();

          // Return to login
          this.$router.push('/login');
        }
      } else {
        console.log(`Access token expires in ${isExpired}`);
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
