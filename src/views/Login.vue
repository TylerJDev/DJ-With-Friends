<template>
  <div class="login">
    <span v-if="errorOccurred" id="error">An error occurred: {{errorType}} <br> Please refresh or contact support!</span>
    <h1 id="loginHeader">Please Login</h1>
    <button id="loginBtn" v-on:click="handleAuthenticate">Login!</button>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      errorOccurred: false,
      errorType: '',
    }
  },
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
          return this.errorHandle('Could not validate response URL');
        }
      }).catch((err) => {
        this.errorHandle(err);
      });
    }, 
    errorHandle(typeError) {
      this.errorOccurred = true;
      this.errorType = typeError;
      console.log(`An error occurred! ${typeError}`);
      return false;
    }
  }, 
  created() {
    if (this.$store.state.errorOccurred !== false && this.$store.state.errorOccurred.route === this.$route.path) {
      this.errorHandle(this.$store.state.errorOccurred.errorType);
      this.$store.commit('errorHandle', false);
    }
  }
}
</script>
