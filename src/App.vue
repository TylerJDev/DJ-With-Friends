<template>
  <div id="app" :class="this.$store.state.darkMode == true ? 'dark' : ''" :data-current-route="this.$route.name">
    <span id="prefer"></span>
    <router-view :user="user" @logout="logout"/>
    <cv-toast-notification v-if="grabNotifications.initialised"
      :kind="typeNotify"
      :title="grabNotifications.title"
      :sub-title="grabNotifications.subtitle"
      :action-label="grabNotifications.actionLabel"
      :low-contrast="grabNotifications.lowContrast"
      aria-live="polite">
    </cv-toast-notification>
    <cv-loading :active="this.$store.state.loading" overlay></cv-loading>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Firebase from 'firebase';
import db from './db.js';

export default {
  data() {
    return {
      typeNotify: this.$store.state.notification.type,
      user: null,
    }
  },
  computed: {
    ...mapGetters([
      'grabNotifications',
      'grabDarkMode'
    ])
  },
  methods: {
    logout: function() {
      Firebase.auth()
      .signOut()
      .then(() => {
        this.user = null;
        this.$router.push('login');
      });
    }
  },
  beforeCreate() {
    // Check localStorage for login state
    var authCode = localStorage.getItem('access_token');
    if (authCode === null) {
      console.log('No access_token found!');
    } else {
      // // Check if access code has expired
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
  },
  mounted() {
    const bgMode = getComputedStyle(this.$el.querySelector('#prefer')).getPropertyValue('content');
    Firebase.auth().onAuthStateChanged(user => {
      if ((user && this.$store.state.spotifyAPIData.firebaseActive === false) || (user && this.$store.state.spotifyAPIData.firebaseActive === 'guest')) {
        this.user = user.displayName;
        this.$store.commit('addFirebaseData', false);
      }
    });
    if (localStorage.getItem('dark_mode') === null) {
      let typeMode = bgMode === '"dark"' ? true : false;
      this.$store.commit('darkMode', {'mode': typeMode});
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700&display=swap');
@import url('https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap');
@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,500,600,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@700&display=swap');

@media (max-width: 66rem) {
  #app {
    height: auto !important;
  }

  div.bx--modal-container {
    height: 90% !important;
    width: 90% !important;
  }
}

@media (max-width: 50rem) {

}

body.aboutDark {
  background-color: $bg--dark !important;
}

body {
   background-color: rgb(226, 215, 202) !important;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  background-color: rgb(226, 215, 202);
  &[data-current-route="login"] {
    height: 200vh !important; /* fix for body height issue */
  }
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

.modal-backdrop.show {
    opacity: 0.8 !important;
}

.cv-notifiation.bx--toast-notification {
  right: 0;
  bottom: 0;
  position: fixed !important;
  width: 25rem !important;
  text-align: left !important;
}

.bx--loading-overlay {
  z-index: 9000 !important;
}

@media (prefers-color-scheme: light) {
  #prefer {
    content: "light";
  }
}


@media (prefers-color-scheme: dark) {
  #prefer {
    content: "dark";
  }
}

#app {
  transition: 1000ms;
  &.dark {
    background-color: $bg--dark;
    .bx--list-box.bx--list-box--inline, select.bx--select-input {
      background-color: $bg--dark;
      border: 1px solid whitesmoke;
      color: whitesmoke;
      .bx--text-input::placeholder, .bx--list-box__label {
        color: whitesmoke !important;
      }
    }

    .room_name {
      background-color: $bg--dark !important;
      border: 1px solid white !important;
      h3 {
        background-color: blue;
      }
    }

    .cv-header.bx--header {
      background-color: $bg--dark;
    }

    input.bx--text-input {
      border-bottom: none;
    }

    #back_to_home {
      color: white !important;
    }

    .slider_btn {
      background-color: #4f4f4f;
      > svg {
        fill: white;
      }
    }

    #login {
      a {
        color: white;
      }

      #loginBtn {
        border-radius: 0px;
        border: 1px solid white;
      }

      #helpModal {
        h5, p, li, a {
          color: black !important;
        }
      }
    }

    .bx--accordion__heading:hover::before {
      background-color: transparent !important;
      border: 2px solid #0f62fe;
    }

    #room_create_modal {
      h2, h4, .room_modal_bio, p {
        color: black !important;
      }

      .bx--multi-select {
        background-color: #ffffff !important;
        input::placeholder {
          color: black !important;
        }
      }
    }

    #help_modal {
      h2, h4, p {
        color: black !important;
      }
    }

    button#card_close > svg {
      fill: white !important;
    }
    h1#main_heading, h2#details_heading {
      background-color: $bg--dark;
    }

    #back_to_home {
      color: whitesmoke;
    }

    .cv-pagination.bx--pagination {
      background-color: $bg--dark;
      span {
        color: white !important;
      }
      .bx--pagination__button {
        background-color: white;
      }
      [disabled="disabled"] {
          background-color: grey !important;
      }
      border: 1px solid whitesmoke;
    }

    h1, h2, h3, h4, h5, h6, p, li, [role="tab"], .navbar a   {
      color: $text--light;
    }

    #artist_container, #side_panel, #progress, .album_cover {
      border: $border--light;
    }

    .navbar, .heart_track {
      svg {
        fill: $fill--light;
      }
    }

    .cv-header-name.bx--header__name {
      &:hover, &:focus, &:active {
        background-color: $bg--light;
        color: $text--light;
      }
    }

    #view_all button {
      color: $text--light;
    }

    .cv-tile-standard {
      background-color: $bg--dark;
      border: $border--light;
      box-shadow: none;

      .bx--accordion__heading:hover::before {
        background-color: $bg--heavyDark;
      }

      .bx--radio-button__appearance, .bx--checkbox-label::before {
        background-color: $bg--light;
      }
    }

    #current_song  h1 {
      text-shadow: 2px 3px 1px black;
      transition: 500ms;
    }

    .bx--header__menu-item {
      &:hover {
        color: white !important;
      }
      &:active, &:focus {
        background-color: $bg--light;
      }
    }

    #progress__innerbar {
      background-color: white !important;
    }

    #user_icon {
      border: 1px solid white;
    }

    #album_pane {
      h2, h3, li {
        color: black !important;
      }
    }

    .side_panel_tab {
      text-shadow: 0px 1px 4px black;
    }

    #genres > button {
      color: white;
    }

    #footer_links > a, #footer_links button{
      color: white;
    }

    .room_card .room_link, .room_details_btn {
      color: whitesmoke;
      border-color: whitesmoke;
    }
    
    #room_vinyl {
      #sleeve {
        background-color: grey;
        border: 2px solid grey;
        box-shadow: 3px 5px 0px 3px black;
      }
      #vinyl {
        border: 2px solid whitesmoke;
        // border-color: whitesmoke;
        background-color: darkgray;
        box-shadow: 0px 0px 0px 170px grey, 0px 0px 0px 171px whitesmoke, 8px 8px 0px 172px black;
      }
    }

    #users_table {
      color: white;
    }

    #tone_arm {
      filter: contrast(35%);
    }
  }
}

.sr_only {
  @include sr_only;
}
</style>
