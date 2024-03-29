<template>
  <nav class="navbar navbar-expand-lg navbar-light" v-on:keydown="arrowLoop">
    <NotificationAlert />      
    <cv-header aria-label="Main">
      <cv-header-menu-button aria-label="Header menu" aria-controls="side-nav" />
      <cv-skip-to-content href="#main-content">
        Skip to Main Content
      </cv-skip-to-content>
      <a href="/" class="cv-header-name bx--header__name menu_item">
        <span class="desktop_item">
        DJ With Friends
        </span>
        <span class="mobile_item">
        DJWF
        </span>
      </a>

      <a href="/" class="nav_item bx--header__menu-item menu_item mobile_item" role="menuitem">
        Home
      </a>

      <a href="/about" class="nav_item bx--header__menu-item menu_item mobile_item" role="menuitem">
        About
      </a>

    <cv-header-nav aria-label="Sub">
      <li class="cv-header-menu-item nav_item" role="presentation">
        <a href="/" class="nav_item bx--header__menu-item menu_item" role="menuitem">
          Home
        </a>
      </li>
      <li class="cv-header-menu-item nav_item" role="presentation">
        <a href="/about" class="nav_item bx--header__menu-item menu_item" role="menuitem">
          About
        </a>
      </li>
    </cv-header-nav>
      <template v-if="hideBar" slot="header-global">
        <cv-header-global-action
          :aria-expanded="popupNotify === true ? 'true' : 'false'"
          aria-haspopup="true"
          aria-label="Notifications"
          @click="handlePopup"
          class="menu_item" 
          v-if="this.$route.name !== 'login'">
          <Notification20 />
          <p v-if="this.$store.state.activeNotify" class="notifyCount" aria-live="polite">{{this.$store.state.activeNotifyCount}} <span class="sr_only">New Notification(s)</span></p>
        </cv-header-global-action>
        <cv-tile v-if="popupNotify"
          kind="standard"
          theme=""
          id="notify_panel" class="panel" :style="{zIndex: notifyIndex}">
            <div id="notifications_panel">
              <button class="close_popup" aria-label="Close" @click="closePopup('popupNotify')">
                <Close16 role="presentation"/>
                <span class="sr_only">Close</span>
              </button>
              <h3>Notifications</h3>
              <button id="clear_notifications" aria-label="Clear Notifications" @click="clearNotifications">
                <TrashCan16 role="presentation" />
                <span class="sr_only">Clear Notifications</span>
              </button>
            </div>
            <hr/>
            <NotificationList/>
        </cv-tile>
        <cv-header-global-action aria-label="Settings" 
          aria-haspopup="true" 
          :aria-expanded="popupUser === true ? 'true' : 'false'" 
          @click="handlePopup" 
          aria-controls="user-panel" 
          class="menu_item"
          v-if="this.$route.name !== 'login'">
          <UserAvatar20 />
        </cv-header-global-action>
        <cv-tile v-if="popupUser"
            kind="standard"
            theme=""
            id="user_panel" class="panel" :style="{zIndex: userIndex}">
            <button class="close_popup" aria-label="Close" @click="closePopup('popupUser')">
              <Close16 role="presentation"/>
              <span class="sr_only">Close</span>
            </button>
            <h3 id="user_name">{{this.$store.state.spotifyAPIData.user}} <span id="account_type" v-if="guestState">(Guest)</span></h3>
            <div id="user_icon" :style="{backgroundImage: 'url(' + userAvatar + ')'}"><span v-if="userAvatar === false"><i class="far fa-user"></i></span></div>
            <h3>Settings</h3>     
            <cv-accordion>
                <cv-accordion-item id="devices_tab"  v-if="this.$route.name !== 'login'">
                  <template slot="title">Devices</template>
                  <template slot="content"> 
                    <h4 id="device_label">Current Device</h4>
                    <div v-if="!userDevices.length" id="no_devices">
                      <div><InformationFilled16 /></div>
                      <h3>No Devices!</h3> 
                    </div>     
                    <cv-radio-group 
                    :vertical="true"
                    @change="deviceChange"
                    aria-labelledby="device_label" id="device_radio">
                    <cv-radio-button v-for="(item, index) in userDevices" :key="'devices' + index" name="group-1" 
                    :label="item.name" 
                    :value="item.id" 
                    :checked="currentDevice === item.id ? true : false"
                    />
                    </cv-radio-group>
                  </template>
                </cv-accordion-item>
                <cv-accordion-item id="appearance_tab">
                  <template slot="title" >Appearance</template>
                  <template slot="content">
                    <cv-checkbox
                      label="Dark Mode"
                      value="Dark"
                      @change="darkMode"
                      :checked="this.$store.state.darkMode">
                    </cv-checkbox>
                  </template>
                </cv-accordion-item>
                <cv-accordion-item id="hosting_tab" v-if="this.$route.name !== 'login'">
                  <template slot="title">Hosting</template>
                  <template slot="content">
                    <p>Enable always-hosting</p>
                    <cv-checkbox
                      label="Always Host"
                      value="Host"
                      @change="hostMode"
                      :checked="this.$store.state.hostMode">
                    </cv-checkbox>
                  </template>
                </cv-accordion-item>
            </cv-accordion>
              <div id="log_settings">
                <cv-button
                :kind="kind"
                :size="size"
                :disabled="disabled"
                @click="logout"
                :icon="false"  v-if="this.$route.name !== 'login'">Sign Out</cv-button>
            </div>
          </cv-tile>

          <div id="login-sign-nav" v-if="this.$route.name === 'login'">
            <div class="login-nav-container nav-container">
              <button id="loginNav" @click="handleAuth">Log In</button>
            </div>
          </div>
      </template>
    </cv-header>
  </nav>
</template>

<script>
import NotificationList from '@/components/NotificationList.vue';
import NotificationAlert from '@/components/NotificationAlert.vue';
import { focusEle } from '@/utils/focus.js';

export default {
  props: {
    notifications: Object,
    hideBar:  {
      type: Boolean,
      required: false,
      default: true
    },
    user: String
  },
  data() {
    return {
      popupNotify: false,
      popupUser: false,
      notifyIndex: 0,
      userIndex: 0,
      checked: this.$store.state.darkMode,
    }
  },
  methods: {
    handlePopup(e) {
     const targetValue = e.target.attributes['aria-label'].value;
     const popupLabels = {'Notifications': 'popupNotify', 'Settings': 'popupUser'}
     
     this[popupLabels[targetValue]] = this[popupLabels[targetValue]] === false ? true : false;
     
      if (popupLabels[targetValue] === 'popupNotify') {
        this.notifyIndex = this.userIndex + 1;

        // If there are active notifications which haven't been seen
        // Then clear, as the user has seen once clicked
        this.$store.commit('modifyNotifyActiveState', {notifyState: false});
      } else if (popupLabels[targetValue] === 'popupUser') {
        this.userIndex = this.notifyIndex + 1;
      }

      setTimeout(() => {
        let toFocus = targetValue === 'Notifications' ? '#notifications_panel .close_popup' : '#user_panel .close_popup';
        focusEle(toFocus);
      }, 50);
    },
    arrowLoop(e) {
      // Ensures that user can loop through menu items with arrow keys
      const elem = e.target;
      const arrowTypes = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'];
      const allItems = this.$el.querySelectorAll('.menu_item');

      if (elem.classList.contains('menu_item') && arrowTypes.indexOf(e.code) >= 0) {
        const indexElem = Array.from(allItems).indexOf(e.target); 
        let indexToFocus = 0;
        
        if (e.code === 'ArrowRight') {
          indexToFocus = indexElem >= allItems.length - 1 ? indexToFocus : indexElem + 1;
          focusEle([allItems[indexToFocus]]);
        } else if (e.code === 'ArrowLeft') {
          indexToFocus = indexElem === 0 ? allItems.length - 1 : indexElem - 1;
          focusEle([allItems[indexToFocus]]);
        }
      }

      if (e.code === 'Home') {
        focusEle([allItems[0]]);
      } else if (e.code === 'End') {
        focusEle([allItems[allItems.length - 1]]);
      }
    },
    clearNotifications() {
      this.$store.commit('clearNotifications');
    },
    darkMode(value) {
      this.$store.commit('darkMode', {mode: value});
    },
    hostMode(value) {
      this.$store.commit('hostMode', {mode: value});
    },
    closePopup(typePopup) {
      const labels = {'popupNotify': 'Notifications', 'popupUser': 'Settings'};
      this[typePopup] = false;

      if (typePopup.indexOf('Notifications') >= 0) {
        this.notifyIndex = 0;
      } else {
        this.userIndex = 0;
      } 
  
      focusEle(`[aria-label="${labels[typePopup]}"]`);
    },
    deviceChange(e) {
      const currentDevices = JSON.parse(this.$store.getters.grabDevices).devices;
      const deviceCurrent = currentDevices.findIndex(current => current.id === e);
      if (deviceCurrent >= 0) {
        this.$emit('change-device', {'id': currentDevices[deviceCurrent].id, 'route': this.$route.params.id});
        // this.$store.dispatch('changeMainDevice', {'id': currentDevices[deviceCurrent].id, 'route': this.$route.params.id});
      }
    },
    logout() {
      this.$store.dispatch('handleLogout');
    },
    handleAuth() {
      this.$emit('handle-modal', {'event': 'login'});
    }
  },
  computed: {
    userAvatar() {
      const avatar = this.$store.state.spotifyAPIData.images != false ? JSON.parse(this.$store.state.spotifyAPIData.images) : false;
      if (!avatar || !avatar.length) {
        return false; 
      }
      return avatar[0].url;
    },
    userDevices() {
      const user_devices = this.$store.state.spotifyAPIData.devices != false ? JSON.parse(this.$store.state.spotifyAPIData.devices) : false;
      if (!user_devices) {
        return false;
      }

      return user_devices.devices;
    },
    currentDevice() {
      const deviceOf = this.$store.state.spotifyAPIData.mainDevice;
      return deviceOf == null ? this.userDevices[0].id : deviceOf;
    },
    guestState() {
      if (this.$store.state.spotifyAPIData.firebaseActive === 'guest') {
        return true;
      } else {
        return false;
      }
    }
  },
  components: {
    NotificationList,
    NotificationAlert
  }
}
</script>

<style lang="scss">
  @media (min-width: 66rem) {
    .mobile_item {
      display: none !important;
    }
  }

  @media (max-width: 66rem) {
    .bx--header__menu-toggle, .desktop_item {
      display: none !important;
    }
  }

  #nav_controls, #nav_controls button {
    height: 100%;
    width: 65px;
    border: none;
    font-size: 1.3rem;
    width: initial;
    padding: 0px 30px 0px 30px;
  }

  .bx--header__global {
    button.cv-header-global-action > * {
      pointer-events: none;
    }
  }

  #devices_tab.bx--accordion__content {
    padding-right: 0% !important;
    padding-left: 0%;
  }

  .navbar {
    height: 60px; 
    padding: 0px;
    font-family: 'IBM Plex Sans', sans-serif;
    background-color: transparent;
    z-index: 5;
  }

  .cv-header.bx--header {
    background-color: #e2d7ca;
  }

  .cv-header-name.bx--header__name {
    color: white;
    background-color: #0000cc;
    margin-right: -5px;
    text-transform: uppercase;
    font-weight: 300;
    &:hover, &:focus, &:active {
      background-color: white;
      color: black;
    }
  }

  .bx--header__menu-item {
    color: black !important;
    &:hover {
      color: white !important;
    }
    &:active, &:focus {
      color: white !important;
      border: 2px solid black !important;
      background-color: black;
    }
  }

  .bx--header__action {
    border-left: 1px solid black;
    z-index: 1;
    @extend .bx--header__menu-item;
    svg {
      fill: black !important; 
      z-index: -1;
    }
    &:focus, &:hover, &:active {
      svg {
        fill: white !important;
      }
    }
  }

  .panel {
    position: absolute !important;
    top: 52px;
    border: 1px solid black;
    min-height: 223px !important;
    width: 260px;
    background-color: white !important;
    padding-top: 5px !important;
    text-align: initial;
    border-radius: 3px 3px 3px 3px;
    -webkit-box-shadow: 3px 0px 7px -1px rgb(107, 107, 107);
    -moz-box-shadow: 3px 0px 7px -1px rgb(107, 107, 107);
    box-shadow: 3px 0px 7px -1px rgb(107, 107, 107);
    .panel_list {
      padding: 3px;
      height: 160px;
      li {
        margin-top: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid black;
        &:last-of-type {
          border-bottom: none;
        }
      }
    }
    hr {
      margin: 3px;
    }

    h3 {
      font-size: 1rem;
      text-align: center;
      font-weight: 600;
    }

    .time_added {
      font-weight: lighter;
      font-size: 0.7rem;
    }
    .close_popup {
      border: none;
      background-color: transparent;
      height: 35px;
      width: 35px;
    }
  }

  #notify_panel {
    right: 51px;
  }

  #user_panel {
    right: 3px;
  }

  #user_icon {
    border: 1px solid black;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: auto;
    margin-top: 5px;
    background-size: cover;
    display: flex;
    background-color: #eee;
    span {
      margin: 0 auto;
      .fa-user {
        padding-top: 10px;
        font-size: 2rem;
      }
    }
  }

  #notify_panel {
    max-height: 320px;
    overflow: auto;
  }
  #notifications_panel {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    h3 { 
      display: inline-block;
    }
    #clear_notifications {
      border: 0;
      background-color: transparent;
    }
  }

  .cv-accordion {
    h4 {
      font-size: 1rem;
      text-align: center;
    }
    .bx--radio-button__label {
      font-size: 0.7rem;
    }
  }

  #user_panel .close_popup {
    right: 0px;
    position: absolute;
  }

  #no_devices {
    position: relative;
    top: 25%;
    color: grey;
    div {
      display: flex;
      justify-content: center;
      svg {
        width: 30px;
        height: 30px;
        fill: grey;
      }   
    }
  }

  #account_type {
    font-size: 0.8rem;
    color: #afafaf;
    font-style: italic;
  }

  #log_settings {
    width: 100%;
    display: flex;
    justify-content: center;
    > button {
      margin-top: 15px;
      border: 1px solid white;
      text-align: center;
      padding-left: 25px;
      padding-right: 25px;
    }
  }

  .notifyCount {
    background-color: blue;
    padding: 3px;
    border-radius: 3px;
    color: white;
    border: 1px solid white;
    position: relative;
    bottom: 8px;
    display: inline;
    font-size: 0.6rem;
  }

  #login-sign-nav {
    display: flex;
    height: 100%;
    .nav-container, .nav-container button {
      height: 100%;
      button {
        border: none;
        color: white;
        background-color: blue;
        padding: 0px 10px 0px 10px;
        width: 80px;
        font-weight: 300;
        font-size: 1rem;
      }
    }
  }

button#loginNav {
  &:focus, &:hover, &:active {
    background-color: black;
    border: 1px dashed white;
  }
}
</style>
