<template>
  <div class="login">
    <h1 id="loginHeader">Please Login</h1>
    <button id="loginBtn" v-on:click="handleAuthenticate">Login!</button>
  </div>
</template>

<script>
export default {
  name: 'login',
  methods: {
    handleAuthenticate() {
      return fetch('http://localhost:3000/login', {
        method: 'GET'
      }).then(res => res.text())
      .then(res => {
        if (res.substring(0, 68) === 'https://accounts.spotify.com/authorize?response_type=code&client_id=') {
          window.location = res;
          return true;
        } else {
          console.log('An error occurred! Could not validate response URL');
          return false;
        }
      });
    }
  }
}
</script>
