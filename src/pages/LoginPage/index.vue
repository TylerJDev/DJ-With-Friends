<template>
  <div id="login">
    <Navbar />
    <div id="cta">
      <h1 id="loginHeader">DJ With Friends</h1>
      <h2>Connect With Spotify</h2>
      <button id="loginBtn" class="btn btn-primary btn-lg" v-on:click="handleAuthenticate">Connect</button>
      <a href="#" class="help_link" role="button" data-toggle="modal" data-target="#helpModal">How does it work?</a>
    </div>
     <Footer />
     <Modal />
  </div>
</template>

<script>
import Navbar from '@/pages/LoginPage/LoginNavbar.vue';
import Footer from '@/pages/LoginPage/LoginFooter.vue';
import Modal from '@/pages/LoginPage/HelpModal.vue';

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
      return fetch(this.$store.state.location + 'login', {
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
      this.$store.dispatch('handleNotification', {'timeout': 10000, 'type': 'error', 'initialised': true, 'title': 'Connection To Server Failed', 'subtitle': 'Failed to connect to the server, please try again or contact support!'});
      return false;
    }
  },
  created() {
    if (this.$store.state.errorOccurred !== false && this.$store.state.errorOccurred.route === this.$route.path) {
      this.errorHandle(this.$store.state.errorOccurred.errorType);
      this.$store.commit('errorHandle', false);
    }
  },
  components: {
    Navbar,
    Footer,
    Modal
  }
}
</script>

<style lang="scss" scoped>
  @mixin center-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Roboto Condensed', sans-serif;
  }
  
  #login {
    height: 100vh;
  }

  #cta {
    @include center-content;
    height: 90%;

    #loginHeader {
      font-weight: 700;
    }

    h2 {
      margin: 5px;
    }

    #loginBtn {
      margin: 15px;
      background-color: black;
      color: white;
      border: none;
    }
    
    .help_link {
      @include help_link;
    }
  }
</style>
