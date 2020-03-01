<template>
  <nav class="navbar navbar-expand-lg navbar-light">      
    <cv-header aria-label="Carbon header">
      <cv-header-menu-button aria-label="Header menu" aria-controls="side-nav" />
      <cv-skip-to-content href="#main-content">
        Skip to content
      </cv-skip-to-content>
      <cv-header-name href="/">
        Collabey
      </cv-header-name>
      <cv-header-nav aria-label="Carbon nav">
      <cv-header-menu-item href="/" class="nav_item">
        Home
      </cv-header-menu-item>
      <cv-header-menu-item href="/about" class="nav_item" style="color: black !important">
        About
      </cv-header-menu-item>
    </cv-header-nav>
      <template slot="header-global">
        <cv-header-global-action
          :aria-expanded="popupNotify === true ? 'true' : 'false'"
          aria-haspopup="true"
          aria-label="Notifications"
          @click="handlePopup" >
          <Notification20 />
        </cv-header-global-action>
        <cv-tile v-if="popupNotify"
          kind="standard"
          theme=""
          id="notify_panel" class="panel" :style="{zIndex: notifyIndex}">
            <div id="notifications_panel">
              <button id="clear_notifications" aria-label="Clear Notifications" @click="clearNotifications">
                <TrashCan16 role="presentation" />
                <span class="sr_only">Clear Notifications</span>
              </button>

              <h3>Notifications</h3>

              <button class="close_popup" aria-label="Close" @click="closePopup('popupNotify')">
                <Close16 role="presentation"/>
                <span class="sr_only">Close</span>
              </button>
            </div>
            <hr/>
            <NotificationList/>
        </cv-tile>
        <cv-header-global-action aria-label="User avatar"  aria-haspopup="true" :aria-expanded="popupUser === true ? 'true' : 'false'" @click="handlePopup" aria-controls="user-panel">
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
            <h3 id="user_name">{{this.$store.state.spotifyAPIData.user}}</h3>
            <div id="user_icon" :style="{backgroundImage: 'url(' + userAvatar + ')'}"><span v-if="userAvatar === false"><i class="far fa-user"></i></span></div>
            <h3>Settings</h3>     
            <cv-accordion>
                <cv-accordion-item>
                  <template slot="title">Devices</template>
                  <template slot="content"> 
                    <h4 id="device_label">Current Device</h4>
                    <div v-if="!userDevices.length" id="no_devices">
                      <div><InformationFilled16 /></div>
                      <h3>No Devices!</h3> 
                    </div>     
                    <cv-radio-group 
                    vertical="true"
                    @change="deviceChange"
                    aria-labelledby="device_label" id="device_radio">
                    <cv-radio-button v-for="(item, index) in userDevices" :key="'devices' + index" name="group-1" 
                    :label="item.name" 
                    :value="item.id" 
                    :checked="currentDevice === item.id ? true : false"
                    :label-left="labelLeft" />
                    </cv-radio-group>
                  </template>
                </cv-accordion-item>
                <cv-accordion-item>
                  <template slot="title">Appearance</template>
                  <template slot="content">
                    <cv-checkbox
                      label="Dark Mode"
                      value="Dark"
                      @change="darkMode"
                      :checked="checked">
                    </cv-checkbox>
                  </template>
                </cv-accordion-item>
                <!-- <cv-accordion-item>
                  <template slot="title">Hosting</template>
                  <template slot="content">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  </template>
                </cv-accordion-item> -->
            </cv-accordion>
          </cv-tile>
      </template>
    </cv-header>
  </nav>
</template>

<script>
import NotificationList from '@/components/NotificationList.vue'
import { focusEle } from '@/utils/focus.js';

export default {
  props: {
    notifications: Object
  },
  data() {
    return {
      popupNotify: false,
      popupUser: false,
      notifyIndex: 0,
      userIndex: 0,
      checked: this.$store.state.darkMode
    }
  },
  methods: {
    handlePopup(e) {
     const targetValue = e.target.attributes['aria-label'].value;
     const popupLabels = {'Notifications': 'popupNotify', 'User avatar': 'popupUser'}
     
     this[popupLabels[targetValue]] = this[popupLabels[targetValue]] === false ? true : false;
     
      if (popupLabels[targetValue] === 'popupNotify') {
        this.notifyIndex = this.userIndex + 1;
      } else if (popupLabels[targetValue] === 'popupUser') {
        this.userIndex = this.notifyIndex + 1;
      }

      setTimeout(() => {
        let toFocus = targetValue === 'Notifications' ? '#notifications_panel .close_popup' : '#user_panel .close_popup';
        focusEle(toFocus);
      }, 50);
    },
    clearNotifications() {
      this.$store.commit('clearNotifications');
    },
    darkMode(value) {
      this.$store.commit('darkMode', {mode: value});
    },
    closePopup(typePopup) {
      const labels = {'popupNotify': 'Notifications', 'popupUser': 'User avatar'};
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
      }
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
    }
  },
  components: {
    NotificationList
  }
}
</script>

<style lang="scss">
  #nav_controls, #nav_controls button {
    height: 100%;
    width: 65px;
    border: none;
    font-size: 1.3rem;
    width: initial;
    padding: 0px 30px 0px 30px;
  }

  .navbar {
    height: 60px; 
    padding: 0px;
    font-family: 'IBM Plex Sans', sans-serif;
    background-color: transparent;
  }

  .cv-header.bx--header {
    background-color: transparent;
  }

  .cv-header-name.bx--header__name {
    color: white;
    background-color: black;
    margin-right: -5px;
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
    background-size: cover;
    display: flex;
    background-color: #eee;
    span {
      margin: 0 auto;
      .fa-user {
        padding-top: 5px;
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
</style>
