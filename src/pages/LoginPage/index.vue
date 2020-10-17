<template>
  <div id="login">
    <Navbar v-if="navbarVisible" />
    <div id="cta" class="container-row">
      <div class="c-4">
        <h1 id="loginHeader">DJ With Friends</h1>
        <p>Join the fun, DJ with your friends!
          Collaborate with fellow music lovers!
          Share your favorite music!
        </p>
        <!-- <button id="loginBtn" class="btn btn-primary btn-lg" v-on:click="handleAuthenticate">Connect</button> -->
        <div id="auth-container">
          <button id="registerBtn" class="btn btn-primary btn-lg btn-auth" v-on:click="authModal({'event': 'register'})">Sign Up</button>
          <button id="loginBtn" class="btn btn-primary btn-lg btn-auth" v-on:click="authModal({'event': 'login'})">Login</button>
          
          <button id="guestLogin" class="btn btn-primary btn-lg btn-auth" v-on:click="handleGuest">Continue As Guest</button>
        </div>
        <!-- <a href="#" class="help_link" role="button" data-toggle="modal" data-target="#helpModal">How does it work?</a> -->
      </div>

      <div class="c-8 vinyl_main">
        <div class="vinyl">
          <div class="vinyl_inner">
          </div>
        </div>
        <div class="vinyl_container" :style="{backgroundImage: 'url(./album1.png)'}">
        </div>
      </div>
    </div>

    <div id="featured" class="container-row">
      <h2>Featured Rooms</h2>

      <div id="rooms">
        <div class="room_feat">
          <div class="room_body">
            <div class="room_name">
              <h3>Tyler's Room</h3>
            </div>
          </div>
          <div class="room_footer">
            <p>Now Playing</p>
            <h3>Igor's Theme</h3>

            <p>0:39 / 3:20</p>

            <button class="btn btn-primary btn-lg btn-auth" v-on:click="authModal({'event': 'login'})">Join Room</button>
          </div>
        </div>

        <div class="room_feat">
          <div class="room_body">
            <div class="room_name">
              <h3>Jazzy Hop</h3>
            </div>
          </div>
          <div class="room_footer">
            <p>Now Playing</p>
            <h3>The Summer</h3>

            <p>0:50 / 6:15</p>

            <button class="btn btn-primary btn-lg btn-auth" v-on:click="authModal({'event': 'login'})">Join Room</button>
          </div>
        </div>

        <div class="room_feat">
          <div class="room_body">
            <div class="room_name">
              <h3>West Coast</h3>
            </div>
          </div>
          <div class="room_footer">
            <p>Now Playing</p>
            <h3>Drive In</h3>

            <p>0:00 / 4:00</p>

            <button class="btn btn-primary btn-lg btn-auth" v-on:click="authModal({'event': 'login'})">Join Room</button>
          </div>
        </div>
      </div>
    </div>

    <div id="quick-bio" class="container-row">
      <div class="c-4">
      <h2>A fun way
        to collab!
      </h2>
      <p>DJ With Friends was created so that you could share your love of music.
        <br/>
        <br/>
        Collaboration is a key feature.
        Being able to collaborate with another
        is how we come together. 
        DJ With Friends focuses on collaboration.
      </p>
      </div>

      <div class="c-8">
        <div class="site_container" :style="{backgroundImage: 'url(./DJWF_1.png)'}">
        </div>
        <div class="site_container" :style="{backgroundImage: 'url(./DJWF_2.png)'}">
        </div>
      </div>
    </div>


    <div id="join-us" class="container-row">
      <div class="col-header">
        <h2>Come join our community!</h2>
      </div>

      <div class="section">
        <div class="c-4">
          <h3 role="presentation" aria-hidden="true">DJ With Friends</h3>
          <div class="web_container">
          </div>
          <div class="web_container">
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-lg btn-auth" v-on:click="authModal({'event': 'register'})">Join Now</button>
    </div>
     <Footer />
     <Modal />
     <LoginModal @handle-auth="handleAuthenticate" @handle-modal="authModal" v-bind:modal-active="modalActive" v-bind:modal-event-type="modalEventType"/>
  </div>
</template>

<script>
// import Navbar from '@/pages/LoginPage/LoginNavbar.vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/pages/LoginPage/LoginFooter.vue';
import Modal from '@/pages/LoginPage/HelpModal.vue';
import LoginModal from '@/pages/LoginPage/LoginModal.vue';
import Firebase from "firebase";

export default {
  name: 'login',
  props: ["user"],
  data() {
    return {
      errorOccurred: false,
      errorType: '',
      navbarVisible: true,
      modalActive: false,
      modalEventType: '',
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
      this.$store.dispatch('handleNotification', {'timeout': 10000, 'type': 'error', 'initialised': true, 'title': 'Connection To Server Failed', 'subtitle': 'Failed to connect to the server, please try again!'});
      this.$store.commit('notifyUsers', {'type': 'info', 'initialised': true, 'message': 'Connection To Server Failed', 'name': 'Failed to connect to the server, please try again!', 'timeJoined': Date.now()});
      return false;
    },
    authModal({state, event}) {
      if (state === false) {
        this.modalActive = false;
      } else {
        // Send prop to LoginModal
        // Send type of auth (log in/register)
        this.modalActive = true;
        this.modalEventType = event;
      }
    },
    handleGuest() {
      Firebase.auth().signInAnonymously().catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        
        console.error(`Error has occurred! Please make note of the error stated below.`);
        console.error(error);
      });
    },
  },
  created() {
    if (this.$store.state.errorOccurred !== false && this.$store.state.errorOccurred.route === this.$route.path) {
      this.errorHandle(this.$store.state.errorOccurred.errorType);
      this.$store.commit('errorHandle', false);
    }
  },
  mounted() {
    this.$store.state.loading = false;
    const handleEmit = () => { this.handleAuthenticate(); }
    Firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        handleEmit();
      }
    });
  },
  components: {
    Navbar,
    Footer,
    Modal,
    LoginModal
  }
}
</script>

<style lang="scss" scoped>
  @mixin center-content {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: row;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Syncopate', sans-serif;
    color: black;
  }
  
  #login {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .container-row {
    margin-bottom: 8%;
  }
  .c-4 {
    text-align: left;
    width: 30%;
  p {
      font-size: 1.2rem;
      margin-top: 2%;
      // width: 55%;
      font-weight: lighter;
    }
  }

  .vinyl_main {
    display: flex;
  }
  
  .vinyl_container {
    width: 350px;
    height: 350px;
    border: 1px solid black;
    box-shadow: 10px 15px 0px 2px rgba(0,0,0,0.75);
    background-size: cover;
    z-index: 2;
    background-color: #e2d7ca;
    background-color: #353535;
  }

  .vinyl {
    width: 350px;
    height: 350px;
    border: 1px solid black;
    border-radius: 50%;
    left: 180px;
    position: relative;
    background-color: #272727;
    z-index: 1;
    .vinyl_inner {
      border: 1px solid white;
      background-color: #e2d7ca;
      width: 50px;
      height: 50px;
      position: relative;
      top: 150px;
      left: 135px;
      border-radius: 50%;
    }
  }

  #cta {
    @include center-content;
    // height: 90%;
    margin-top: 5%;

    .c-8 {
      margin-top: 2%;
    }
    
    h1 {
      color: black;
      font-size: 2.7rem;
    }

    #loginHeader {
      font-weight: 700;
    }

    h2 {
      margin: 5px;
    }

    #auth-container {
      display: flex;
    }
    .help_link {
      @include help_link;
      font-size: 1.1rem;
    }
  }

  .btn-auth {
    margin-top: 15px;
    background-color: blue;
    color: white;
    border: 1px solid white;
    border-radius: 0%;
    margin-right: 10px;
    box-shadow: -4px 4px 0px black;
    font-size: 1.1rem;
    &:focus {
      border: 1px dashed white;
      text-decoration: underline;
    }
  }

  #featured {
    #rooms {
      @include center-content;
      
      .btn-auth {
        font-size: 1rem;
        float: right;
      }
      .room_feat {
        h3 {
          font-size: 1.3rem;
        }
        p {
          font-size: 0.9rem;
          font-family: 'IBM Plex Sans', sans-serif;
        }
        display: flex;
        flex-direction: column;
        border: 1px solid black;
        height: 300px;
        width: 300px;
        box-shadow: -4px 4px 0px black;
        margin-top: 50px;
        .room_body {
          height: 50%;
          .room_name {
            border: 1px solid black;
            position: relative;
            width: 170px;
            right: 130px;
            top: 5px;
            box-shadow: -3px 3px 0px black;
            background-color: #e2d7ca;
            h3 {
              font-size: 1rem;
            }
          }
        }

        .room_footer {
          text-align: left;
          padding: 10px;
          border-top: 1px solid black;
        }
      }
    }
  }

  #quick-bio {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    h2 {
      font-size: 2rem;
    }

    p {
      font-size: 1.5rem;
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: lighter;
    }

    .c-8 {
      width: 50%;
      display: flex;
      justify-content: center;
      .site_container:last-of-type {
        position: relative;
        top: 90px;
        right: 75px;
        height: 233px;
      }

      // box-shadow: 0 16px 64px 0 rgba(16,17,49,.32);
    }

    .site_container {
      height: 240px;
      width: 600px;
      border: 1px solid black;
      background-size: contain;
      background-repeat: no-repeat;
      box-shadow: 3px 3px 0px black;
    }
  }

  #join-us {
    background-color: white;
    padding-top: 150px;
    padding-bottom: 150px;
    margin-bottom: 0px;
    .section {
      display: flex;
      justify-content: space-around;
      flex-direction: row;
      min-height: 550px;
      h2 {
        color: #515151;
      }

      h3 {
        position: absolute;
        font-size: 5rem;
        z-index: 3;
        color: white;
        text-shadow: -1px 0 blue, 0 1px blue, 1px 0 blue, 0 -1px blue;
        text-transform: uppercase;
      }
      .c-4 {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .web_container {
          margin-top: 50px;
          width: 350px;
          height: 350px;
          border: 1px solid black;
          box-shadow: 10px 15px 0px 2px rgba(0,0,0,0.75);
          background-size: cover;
        }

        .web_container:last-of-type {
          position: relative;
          top: 50px;
          right: 50px;
          background-color: white;
        }
      }
    }

    .btn-auth {
      margin-top: 15px;
      background-color: blue;
      color: white;
      border: 1px solid white;
      border-radius: 0%;
      margin-right: 10px;
      box-shadow: -4px 4px 0px black;
      font-size: 1.5rem;
    }
  }
</style>
