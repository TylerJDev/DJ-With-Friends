<template>
  <div id="login">
    <Navbar v-if="navbarVisible" @handle-modal="authModal"/>
    <div id="cta" class="container-row">
      <div class="c-4">
        <h1 id="loginHeader">DJ <br><span class="logo-color">With</span> <br>Friends</h1>
        <p>Join the fun, DJ with your friends!
          Collaborate with fellow music lovers!
          Share your favorite music!
        </p>
        <!-- <button id="loginBtn" class="btn btn-primary btn-lg" v-on:click="handleAuthenticate">Connect</button> -->
        <div id="auth-container">
          <button id="registerBtn" class="btn btn-primary btn-lg btn-auth auth-type" v-on:click="authModal({'event': 'register'})">Get Started</button>
          <button id="loginBtn" class="btn btn-primary btn-lg btn-auth" v-on:click="authModal({'event': 'login'})" style="display: none;">Login</button>
          
          <button id="guestLogin" class="btn btn-primary btn-lg btn-auth" v-on:click="handleGuest" style="display: none;">Continue As Guest</button>
        </div>
        <div class="community-div">
          <div class="avatar-icon" :style="{backgroundImage: 'url(./avatar_1.png)'}"></div>
          <div class="avatar-icon" :style="{backgroundImage: 'url(./avatar_2.png)'}"></div>

          <p><a href="#" class="join-us auth-type" v-on:click="authModal({'event': 'register'})">Join our community</a> to be a part of the fun!</p>
        </div>
        <!-- <a href="#" class="help_link" role="button" data-toggle="modal" data-target="#helpModal">How does it work?</a> -->
      </div>
      <div class="c-8 vinyl-main">
        <div class="vinyl" style="display: none;">
          <div class="vinyl-inner">
          </div>
        </div>
        <div class="vinyl-container">
        </div>
      </div>
    </div>

    <section id="quick-sum" class="container-row">
      <div id="summary">
        <p id="bio-sum"><strong>DJ With Friends</strong> was created so that you could share your love of music.
          Collaboration is a <strong>key</strong> feature.
          Being able to collaborate with another
          is how we come together. <br/><br/>
          <strong>DJ With Friends</strong> focuses on that collaboration.
        </p>

        <div>
          <a href="#" class="join-link join-us auth-type" v-on:click="authModal({'event': 'register'})">Join Our Community</a>
        </div>
      </div>
    </section>

    <section id="quick-preview" class="container-row">
      <div class="container-inner">
        <div id="block">
          <div id="example-block">
            <div id="current-playing" :style="{backgroundImage: 'url(./placeholder_5.png)'}"></div>
            <h2>Eye</h2>
            <h3>Abstract Orchestra</h3>
            <div id="time-of">
              <p>1:{{this.progressCount}}</p>
              <p>3:21</p>
            </div>
            <div id="playing-time">
              <div class="inner-time" :style="{width: `${this.progressCount - 40 + 50}%`}"></div>
            </div>
            
            <div class="btn-container">
              <div id="mock-button"><button disabled>Add to Queue</button></div> <!-- REFACTOR: Change into real button with disabled? -->
              <div id="mock-heart"><button disabled><i class="far fa-heart"></i></button></div>
            </div>
          </div>

          <div id="example-user-container">
            <div class="user-banner">
              Host
            </div>
            <div class="example-user">
              <div class="avatar-icon" :style="{backgroundImage: 'url(./avatar_1.png)'}"></div>
              <div class="user-container">
                <h3>Tyler</h3>
                <p>Listening to: <span class="logo-color">Eye</span></p>
              </div>
            </div>

            <div class="user-banner">
              Co-Host
            </div>
            <div class="example-user">
              <div class="avatar-icon" :style="{backgroundImage: 'url(./avatar_2.png)'}"></div>
              <div class="user-container">
                <h3>Tanya</h3>
                <p>Listening to: <span class="logo-color">Eye</span></p>
              </div>
            </div>

            <div class="user-banner">
              Co-Host
            </div>
            <div class="example-user">
              <div class="avatar-icon" :style="{backgroundImage: 'url(./avatar_3.png)'}"></div>
              <div class="user-container">
                <h3>Anna</h3>
                <p>Listening to: <span class="logo-color">Eye</span></p>
              </div>
            </div>
          </div>
        </div>

        <div class="bio_block c-4">
          <p><strong class="logo-color">DJ With Friends</strong> aims to be a quick and easy way to listen to music with others.
              We also try to incorporate an accessible and welcoming environment so that everyone can enjoy the music.
          </p>

          <ul>
            <li><i class="fas fa-compact-disc list-icon"></i> Create your own room for you and your friends, or the entire world</li> 
            <li><i class="fas fa-compact-disc list-icon"></i> Quick and accessible way to listen to music with others</li>
            <li><i class="fas fa-compact-disc list-icon"></i> Discover all types of new music</li>
          </ul>

          <p>What are you waiting for? <strong>Let's DJ!</strong></p>
          <button id="bio-registerBtn" class="btn btn-primary btn-lg btn-auth auth-type" v-on:click="authModal({'event': 'register'})">Get Started</button>
        </div>
      </div>
    </section>

    <div id="featured" class="container-row">
      <h2>Featured</h2>

      <div id="rooms">
        <div id="rooms_container">
          <div id="current-room">
            <h2>Lo-Fi & Low Vocals</h2>
            <h3>Tyler Jones.</h3>
            <p>
              Music Composed,
              Orchestrated and
              Conducted by TJD
            </p>

            <h4>EMMY AWARD NOMINATIONS 2020</h4>
          </div>

          <div class="room-feat">
            <div class="room_body" :style="{backgroundImage: 'url(./placeholder_1.png)'}">

            </div>
            <div class="room-footer">
              <p>Now Playing</p>
              <h3>Igor's Theme</h3>

              <p>0:39 / 3:20</p>

              <button class="btn btn-primary btn-lg btn-auth auth-type" v-on:click="authModal({'event': 'login'})">Join Room</button>
            </div>
          </div>
        </div>

        <!-- <div class="room-feat">
          <div class="room_body" :style="{backgroundImage: 'url(./placeholder_2.png)'}">
            <div class="room_name">
              <h3>Jazzy Hop</h3>
            </div>
          </div>
          <div class="room-footer">
            <p>Now Playing</p>
            <h3>The Summer</h3>

            <p>0:50 / 6:15</p>

            <button class="btn btn-primary btn-lg btn-auth" v-on:click="authModal({'event': 'login'})">Join Room</button>
          </div>
        </div>

        <div class="room-feat">
          <div class="room_body" :style="{backgroundImage: 'url(./placeholder_3.png)'}">
            <div class="room_name">
              <h3>West Coast</h3>
            </div>
          </div>
          <div class="room-footer">
            <p>Now Playing</p>
            <h3>Drive In</h3>

            <p>0:00 / 4:00</p>

            <button class="btn btn-primary btn-lg btn-auth" v-on:click="authModal({'event': 'login'})">Join Room</button>
          </div>
        </div> -->
      </div>
      <div id="room-playlist">
        <FeaturedSkeleton v-for="index in 6" :currentIndex="index" v-if="trackData === null"/>
        <FeaturedTrack v-for="(item, index) in trackData" :trackType="trackData[index]" :currentIndex="index"/>
      </div>
      <div id="moreRooms">
        <a href="#" class="join-link join-us auth-type" v-on:click="authModal({'event': 'register'})">View Featured Rooms</a>
      </div>
    </div>

    <div id="quick-bio" class="container-row" style="display: none;">
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
        <div class="site_container" :style="[this.$store.state.darkMode ? {backgroundImage: 'url(./DJWF_3.png)'} : {backgroundImage: 'url(./DJWF_1.png)'}]">
        </div>
        <div class="site_container" :style="[this.$store.state.darkMode ? {backgroundImage: 'url(./DJWF_4.png)'} : {backgroundImage: 'url(./DJWF_2.png)'}]">
        </div>
      </div>
    </div>


    <div id="join-us" class="container-row">
      <div class="section">
        <div class="c-4">
          <h3 role="presentation" aria-hidden="true">DJ With Friends</h3>
          <div class="web_container" :style="{backgroundImage: 'url(./album2.png)'}">
          </div>
          <div class="web_container" :style="{backgroundImage: 'url(./album3.png)'}">
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-lg btn-auth auth-type" v-on:click="authModal({'event': 'register'})">Join Now</button>
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
import FeaturedTrack from '@/pages/LoginPage/FeaturedTrack';
import FeaturedSkeleton from '@/pages/LoginPage/FeaturedSkeleton';
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
      trackData: null,
      progressCount: 40,
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

    // Grab data for "#featured"
    const requestFeatured = async () => {
      const response = await fetch(`${this.$store.state.location}playing`);

      const result = await response.json().then((data) => {
          this.trackData = data.trackData.items;
      });
    }
    
    requestFeatured();

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio >= 0.5) {
        intersectionObserver.disconnect();
        let hold = 0;

        /* Play animation */
        const progress = setInterval(() => {
          this.progressCount = (this.progressCount + 1);
          if (this.progressCount >= 50) {
            clearInterval(progress);
          }
        }, 1000);
      }
    }, {threshold: 0.5});

    intersectionObserver.observe(document.querySelector('#block'));
  },
  components: {
    Navbar,
    Footer,
    Modal,
    LoginModal,
    FeaturedTrack,
    FeaturedSkeleton
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

  @media (max-width: $breakpoint--03) {
    .vinyl-main {
      display: none !important;
    }

    #cta {
      padding-top: 50px !important;
      .c-4 {
        width: 100%;
        padding: 20px;
        p {
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .avatar-icon {
          width: 60px;
        }
      }

      h1#loginHeader {
        font-size: 3rem;
      }
    }

    #quick-sum {
      #summary {
        width: 90% !important;
        p#bio-sum {
          font-size: 1.5rem !important;
          margin-bottom: 5px;
        }
        a {
          width: 100%;
          font-size: 1.3rem;
        }
      }
    }

    #quick-preview {
      height: unset !important;
      .container-inner {
        flex-direction: column;
        justify-content: unset;
        #block {
          flex-direction: column;
          align-items: center;
          width: 100%;
          #example-block {
            width: 250px;
          }
          #example-user-container > div {
            margin-left: 0px !important;
          }
        }

        .bio_block {
          width: 100%;
          padding: 20px;
          margin-top: 20px;
          p {
            font-size: 1.3rem;
            width: 100%;
          }
          ul {
            font-size: 1rem;
          }

          ul + p {
            margin-top: 20px;
            line-height: 2rem;
          }
          button.btn-auth {
            width: 100%;
            margin-right: 0px;
          }
        }
      }
    }

    #featured {
      #rooms {
        height: unset !important;
        #rooms_container {
          width: 100% !important;
          flex-direction: column;
          padding: 20px;
          margin-top: 0px !important;
          align-items: center;
          #current-room {
            margin-bottom: 20px;
            h2 {
              font-size: 1rem !important;
            }
          }
          
          .room-feat {
            width: 250px !important;
          }
          
          .btn-auth {
            width: 100% !important;
            margin-right: 0px;
          }
        }
      }

      #room-playlist {
        margin-top: 30px;
        .playlist-track-skeleton, .playlist-track {
          width: 80%;
        }
      }
    
      #moreRooms {
        margin-top: 50px !important;
      }
      
      padding-bottom: 100px;
    }

    #join-us {
      padding: 0px !important;
      display: none;

      .section {
        min-height: 400px !important;
      }
      h3 {
        font-size: 2.5rem !important;
        text-align: center;
      }
      
      .web_container {
        width: 250px !important;
        height: 250px !important;
      }

      .web_container:last-of-type {
        display: none;
      }

      .btn-auth {
        width: 80%;
        margin-right: 0px !important;

      }
    }

    #quick-bio {
      display: none !important;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Syncopate', sans-serif;
    color: black;
  }

  /* Global Class Styles */
  .join-us {
    &:hover {
      text-decoration: none;
      outline: -webkit-focus-ring-color auto 1px;
    }
  }

  .logo-color {
    color: $logo--color;
    font-weight: bold;
  }
  
  #login {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .container-row {
    padding-bottom: 8%;
    padding-top: 8%;
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

  .vinyl-main {
    display: flex;
  }
  
  .vinyl-container {
    width: 450px;
    height: 450px;
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
    .vinyl-inner {
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

  .avatar-icon {
    margin-top: 15px;
    width: 40px;
    height: 40px;
    border: 2px solid white;
    background-size: cover;
    border-radius: 50%;
    background-color: black;
  }

  #cta {
    @include center-content;
    // height: 90%;
    margin-top: 5%;
    padding-top: 0%;

    .c-8 {
      margin-top: 2%;
    }
    
    h1 {
      color: black;
      font-size: 3.7rem;
    }

    p {
      font-family: 'IBM Plex Sans', sans-serif;
      color: #d2d2d2;
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

    .community-div {
      display: flex;

      .avatar-icon:last-of-type {
        position: relative;
        right: 10px;
      }

      p {
        padding-top: 10px;
      }

      a {
        font-weight: bold;
        border-bottom: $border--logo;
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
    font-size: 1.1rem;
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 500;
    /* Hover, Focus, etc state for btn-auth */
    &.btn-primary:hover, 
    &.btn-primary:focus, 
    &.btn-primary:active, 
    &.btn-primary:focus-within {
      background-color: black;
      border: 1px dashed white;
      outline: none !important;
    }
  }

  #featured {
    background-color: #0e0e0e;
    #rooms {
      @include center-content;
      height: 50vh;
      #rooms_container {
        display: flex;
        justify-content: space-evenly;
        width: 50%;
        margin-top: 50px;
      }

      #current-room {
        width: 300px;
        text-align: initial;
        margin-bottom: 100px;
        h2 {
          font-size: 1.5rem;
        }

        h3 {
          font-size: 1rem;
          color: #dadada !important;
        }

        p {
          margin-top: 30px;
          margin-bottom: 30px;
          width: 70%;
          color: #dadada !important;

        }

        h4 {
          font-size: 0.9rem;
          color: $logo--color;
        }
      }
      
      .btn-auth {
        font-size: 1rem;
        float: right;
      }

      .room-feat {
        border: 1px solid white;
        display: flex;
        flex-direction: column;
        border: 1px solid black;
        height: 300px;
        width: 300px;
        box-shadow: -4px 4px 0px blue;
        .room_body {
          height: 50%;
          background-size: cover;
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

        .room-footer {
          text-align: left;
          padding: 10px;
          border-top: 1px solid black;
        }

        h3 {
          font-size: 1.3rem;
        }

        p {
          font-size: 0.9rem;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #dadada !important;
        }
      }
      button {
        font-weight: 600;
      }
    }

    #room-playlist {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
    }

    #moreRooms {
      margin-top: 100px;
    }
  }

  #quick-sum {
    background-color: #0e0e0e;
    height: 75vh;
    display: flex;
    padding-top: 8%;
    #summary {
      height: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      justify-content: space-evenly;
      width: 70%;
      p {
        font-size: 2.5rem !important;
        line-height: unset;
        strong {
          color: #0f62fe;
        }
      }
    }
  }

  .join-link {
    font-size: 1.6rem;
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    border-bottom: $border--logo;
    &:hover {
      text-decoration: none;
    }
  }

  .container-inner {
    display: flex;
    justify-content: space-around;
  }

  #quick-preview {
    height: 90vh;
    background-color:#2b2b2b;
    #block {
      display: flex;
      flex-direction: row;
      width: 40%;
    }

    #example-block {
      border: 2px solid white;
      background-color: #232323;
      box-shadow: 12px 12px 0px 0px black;
      height: 450px;
      width: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      #current-playing {
        border: 1px solid white;
        width: 220px;
        height: 220px;
        margin-top: 30px;
        background-size: contain;
      }

      #time-of {
        display: flex;
        justify-content: space-between;
        width: 220px;
        p {
          font-size: 0.8rem;
        }
      }
      
      h2, h3 {
        font-family: 'IBM Plex Sans', sans-serif !important;
      }

      h3 {
        font-weight: 600;
        font-size: 1.45rem;
      }

      h2 {
        font-weight: 700;
        font-size: 1.745rem;
        margin-top: 5px;
      }

      #playing-time {
        width: 220px;
        margin-top: 5px;
        height: 10px;
        border: 1px solid white;
        .inner-time {
          height: 100%;
          background-color: white;
        }
      }

      .btn-container {
        display: flex;
        align-items: center;
        #mock-button {
          background-color: $logo--color;
          width: 120px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid white;
          margin-top: 15px;
          button {
            background-color: transparent;
            border: none;
            color: white;
            font-size: 0.875rem !important;
            font-family: 'IBM Plex Sans', sans-serif !important;
          }
        }
        #mock-heart {
          margin-top: 15px;
          margin-left: 5px;
          button {
            height: 40px;
            width: 40px;
            background-color: transparent;
            border: 1px solid white;
            i {
              color: white;
            }
          }
        }
      }
    }

    #example-user-container {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 400px;
      .example-user {
        display: flex;
        align-items: center;
        margin-left: 50px;
        border: 2px solid white;
        width: 300px;
        height: 100px;
        background-color: #232323;
        box-shadow: 12px 12px 0px 0px black;
        .avatar-icon {
          margin-top: 0px;
          margin-left: 10px;
          height: 50px;
          width: 50px;
          border: 3px solid white;
          background-position: 50% -10%;
          background-size: cover;
          background-repeat: no-repeat;
        }
        .logo-color {
          font-weight: normal;
        }
        .user-container {
          padding-left: 10px;
          text-align: left;
          h3 {
            font-size: 1.2rem;
            text-align: left;
            font-family: 'IBM Plex Sans', sans-serif;
            font-weight: bold;
          }
          p {
            font-size: 0.9rem;
            font-weight: normal;
          }
        }
      }

      .user-banner {
        background-color: blue;
        max-width: 100px;
        min-width: 40px;
        margin-left: 60px;
        top: 20px;
        position: relative;
        color: white;
        box-shadow: -3px 3px 0px black;
        padding: 5px;
        border: 1px solid white;
        font-weight: 600;
      }
    }

    .bio_block {
      width: 40%;
      padding-top: 50px;
      p {
        width: 85%;
      }
      button {
        margin-top: 35px;
      }
      ul {
        margin-top: 15px;
        font-size: 1.2rem;
        line-height: 2rem;
        font-family: 'IBM Plex Sans', sans-serif;
        padding-left: 0px;
        font-weight: lighter;
        .list-icon {
          margin-right: 5px;
          color: $logo--color;
        }
      }
    }
  }

  #quick-bio, #quick-sum, #quick-preview {
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
    }

    .site_container {
      height: 240px;
      width: 600px;
      border: 1px solid black;
      background-size: cover;
      background-repeat: no-repeat;
      box-shadow: 3px 3px 0px black;
    }
  }

  #join-us {
    background-color: white;
    padding-top: 50px;
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
