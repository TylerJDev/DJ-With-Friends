<template>
  <div id="app" :class="this.$store.state.darkMode == true ? 'dark' : ''">
    <router-view/>
    <cv-toast-notification v-if="grabNotifications.initialised"
      :kind="typeNotify"
      :title="grabNotifications.title"
      :sub-title="grabNotifications.subtitle"
      :action-label="grabNotifications.actionLabel"
      :low-contrast="grabNotifications.lowContrast"
      aria-live="polite">
    </cv-toast-notification>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      typeNotify: this.$store.state.notification.type
    }
  },
  computed: {
    ...mapGetters([
      'grabNotifications',
      'grabDarkMode'
    ])
  },
  beforeCreate() {
    // Check localStorage for login state
    var authCode = localStorage.getItem('access_token');
    if (authCode === null) {
      console.log('No access_token found!');
    } else {
      //this.$store.dispatch('handleReAuth');
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
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700&display=swap');
@import url('https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap');
@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,500,600,700&display=swap');

@media (max-width: 66rem) {
  #app {
    height: auto !important;
  }
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
    input.bx--text-input {
      border-bottom: none;
    }

    button#card_close > svg {
      fill: white !important;
    }
    h1#main_heading, h2#details_heading {
      background-color: $bg--dark;
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

    #footer_links > a {
      color: white;
    }

    .room_card .room_link, .room_details_btn {
      color: whitesmoke;
      border-color: whitesmoke;
    }
    
    #room_vinyl {
      #sleeve {
        background-color: grey;
        border: 2px solid whitesmoke;
        box-shadow: 3px 5px 0px 3px black;
      }
      #vinyl {
        border: 2px solid whitesmoke;
        // border-color: whitesmoke;
        background-color: transparent;
        box-shadow: 0px 0px 0px 170px grey, 0px 0px 0px 171px whitesmoke, 8px 8px 0px 172px black;
      }
    }

    #users_table {
      color: white;
    }

    #tone_arm {
      filter: contrast(1%);
    }
  }
}

.sr_only {
  @include sr_only;
}
</style>
