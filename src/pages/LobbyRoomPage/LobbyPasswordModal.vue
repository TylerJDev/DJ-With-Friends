<template>
  <cv-modal
    id="passwordRoomModal"
    :close-aria-label="closeAriaLabel"
    :size="size"
    :visible="this.$store.state.passwordRoom.visible"
    :auto-hide-off="autoHideOff"
    @modal-hidden="closeModal">
    <template v-if="use_label" slot="label">Room: <span class="room-id">#{{this.$store.state.passwordRoom.to}}</span></template>
    <template v-if="use_title" slot="title">Enter Room Password</template>
    <template v-if="use_content" slot="content">
      <form class="mt-3" @submit.prevent="enterRoom">

        <div class="error_container" v-if="this.$store.state.passwordRoom.error">
          <div class="col-12 alert alert-danger px-3">{{error}}</div>
        </div>
        
        <label class="form-control-label sr-only" for="roomPassword">Room Password</label>
        <input
          required
          class="form-control"
          type="password"
          id="roomPassword"
          placeholder="Room Password"
          v-model="password"
          autocomplete="off"
        />

        <button class="btn btn-primary blu-btn submit-room" type="submit">Join Room</button>
      </form>
    </template>
  </cv-modal>
</template>

<script>
import { focusEle } from '@/utils/focus.js';

export default {
  name: 'LobbyPasswordModal',
  data() {
    return {
      closeAriaLabel: "Close",
      use_label: true,
      use_title: true,
      use_content: true,
      size: "",
      visible: true,
      autoHideOff: false,
      error: 'Password is incorrect!',
      password: '',
    }
  },
  methods: {
    enterRoom: function() {
      const currentPswState = this.$store.getters.grabPasswordRoomState;
      currentPswState.password = this.password;
      currentPswState.visible = true;
      this.$store.commit('addPasswordRoomState', currentPswState);
      this.$router.push(`/room/${currentPswState.to}`);
      focusEle('#roomPassword');
    },
    closeModal: function() {
      this.$store.commit('addPasswordRoomState', {});
    }
  }
}
</script>

<style lang="scss">
  #passwordRoomModal {
    .bx--modal-container {
      width: 470px !important;
      background-color: white;
      box-shadow: 9px 12px 0px 0px black;
      border: 2px solid black;

      .bx--modal-content {
        height: 100%;
        max-height: unset !important;
        min-height: unset !important;
      }

      input {
        border-radius: 0;
        border: 1px solid black;
        background-color: transparent;
      }
    }

    .error_container {
      width: 100%;
      margin-bottom: 0px;
      margin-top: 10px;
      height: 60px;
      div {
        border-radius: 0%;
        border: 1px solid black;
        box-shadow: 2px 3px 0px 0px black;
        font-family: "IBM Plex Sans", sans-serif; 
        font-weight: 500;
      }
    }
  }

  #app.dark p.bx--modal-header__heading,
  #app.dark p.bx--modal-header__label {
    color: black !important;
    font-family: "IBM Plex Sans", sans-serif; 
    font-weight: 600;
  }

  .room-id {
    color: blue;
  }

  .blu-btn.submit-room {
    @include blu_btn;
    font-family: "IBM Plex Sans", sans-serif; 
    width: 100%;
    font-weight: 700;
    &:hover, &:focus {
      background-color: black;
      border: 1px dashed white;
    }
  }
</style>