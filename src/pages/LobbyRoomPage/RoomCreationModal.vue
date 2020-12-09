<template>
  <div v-if="modalActive" id="room_create_modal" tabindex="-1" role="dialog">
    <cv-modal
      :close-aria-label="closeAriaLabel"
      :size="size"
      :primary-button-disabled="primaryButtonDisabled"
      :auto-hide-off="autoHideOff"
      :visible="visible"
      @primary-click="handleRoomCreation"
      @secondary-click="handleModalClose"
      @modal-hidden="handleModalClose"
      id="room_create_modal">
      <template v-if="use_title" slot="title">Create a room</template>
      <template v-if="use_content" slot="content"><p class="room_modal_bio">Create a room to DJ with others or private with friends!</p></template>
      <template slot="content">
        <div class="bx--form-item bx--form-container bx--room-name">
          <label for="room-name" class="bx--label">Room Name</label>
          <input id="room-name" type="text" :aria-describedby="(createData['room-name'].length < 3 && createData['room-name'].length > 0) || roomNameError.length && createData['room-name'] < 3 ? 'error_msg_x9s0' : false" :class="[(createData['room-name'].length < 3 && createData['room-name'].length > 0) || roomNameError.length && createData['room-name'] < 3 ? 'bx--text-input bx--text-input--invalid' : 'bx--text-input']" placeholder="Room Name" data-modal-primary-focus v-on:input="giveInput" minlength="3" required>
          <div v-if="(createData['room-name'].length < 3 && createData['room-name'].length > 0) || roomNameError.length && createData['room-name'] < 3" id="error_msg_x9s0" class="bx--form-requirement">Minimum Length 3 characters!</div>
        </div>
        <div class="bx--form-item bx--form-container bx--room-genre">
          <cv-multi-select id="room_genres" :class="[roomGenreError === true && !createData['room-genres'].length ? 'bx--text-input--invalid' : '']" title="Choose a genre" @change="giveGenre" :label="label" :options="getAllGenres" :inline="true" :filterable="true" :auto-filter="true" :auto-highlight="true" required></cv-multi-select>
          <div v-if="roomGenreError === true && !createData['room-genres'].length" id="error_msg_nz093" class="bx--form-requirement">Must pick at least 1 genre!</div>
        </div>
        <div class="bx--form-item bx--form-container">
          <p class="bx--label" id="room_limit_label">Room Limit</p>
          <div class="bx--form-flex-container">     
            <cv-radio-group 
              :vertical="false"
              aria-describedby="room_limit_label">
                <cv-radio-button name="room-limit" label="Yes" value="yes" id="room-limit_yes"
              :checked="false"
              :label-left="true" v-on:input="giveInput" />
                <cv-radio-button name="room-limit" label="No" value="no" id="room-limit_no"
              :checked="true"
              :label-left="true" v-on:input="giveInput"/>
            </cv-radio-group>
            <span v-on:click.capture="giveLimit">                
              <cv-number-input
                v-if="createData['room-limit_yes']"
                id="room-limit_current"
                :disabled="false"
                :value="limitValue"
                :min="minLimit"
                :max="maxLimit"
                :step="1"
                :class="[roomUserLimitError === true ? 'bx--text-input--invalid' : '']"
                @input="giveLimit"
                required
                >
            </cv-number-input>
            <div v-if="roomUserLimitError === true" class="bx--form-requirement">Must be 1-1000</div>
            </span>
          </div>
        </div>
        <div class="bx--form-item bx--form-container descr_textarea">   
          <div class="cv-text-area bx--form-item">
            <label for="room-descr" class="bx--label">Room Description</label>
            <div class="bx--form__helper-text">Add a room description for others to read (max, 256)</div>
            <div class="bx--text-area__wrapper">
            <textarea id="room-descr" placeholder="Room Description" maxlength="256" class="bx--text-area" v-on:input="giveInput"></textarea>
          </div>
        </div>
       </div>
        <div class="bx--form-item bx--form-container">
          <p class="bx--label" id="room_private_label">Room Private</p>   
          <div class="bx--form-flex-container">   
            <cv-checkbox
              aria-describedby="room_private_label"
              :label="checkboxLabel"
              :value="checkboxValue"
              id="room-private"
              v-on:input="giveInput"
              >
            </cv-checkbox>
            <div class="bx--form-item" v-if="createData['room-private']">
              <label for="room-password" class="bx--label">Password (4 - 30 characters)</label>
              <input id="room-password" :aria-describedby="roomPasswordLimitError === true ? 'error_msg_p12zs' : false" :class="[roomPasswordLimitError === true ? 'bx--text-input--invalid bx--text-input' : 'bx--text-input']" type="password" minlength="4" maxlength="30" placeholder="Password (Min. 4 characters)" data-modal-primary-focus v-on:input="giveInput" required>
              <div v-if="roomPasswordLimitError === true" class="bx--form-requirement" id="error_msg_p12zs">Password must be 4-30 characters!</div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="use_secondaryButton" slot="secondary-button">Close</template>
      <template v-if="use_primaryButton" slot="primary-button">Create Room</template>
    </cv-modal>
  </div>
</template>

<script>
import { focusEle } from '@/utils/focus.js';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'
import db from '../../../db.js';

export default {
  props: {
      modalActive: Boolean
  },
  data() {
    return {
      closeAriaLabel: "Close",
      use_label: true,
      use_title: true,
      use_content: true,
      size: "small",
      use_secondaryButton: true,
      use_primaryButton: true,
      primaryButtonDisabled: false,
      autoHideOff: false,
      visible: true,
      label: 'Genre',
      checkboxLabel: 'Private',
      checkboxValue: 'private',
      textAreaLabel: "Room Description",
      textAreaDisabled: false,
      use_helperTextSlot: false,
      use_invalidMessageSlot: false,
      invalidMessage: '',
      minLimit: 1,
      maxLimit: 1000,
      limitValue: 1,
      createData: {
        'room-name': '',
        'room-limit_yes': '',
        'room-limit_no': '',
        'room-genres': [],
        'room-descr': '',
        'room-private': false,
        'room-password': '',
      },
      roomNameError: '',
      roomGenreError: false,
      roomUserLimitError: false,
      roomPasswordLimitError: false,
    }
  },
  methods: {
    giveInput(e) {
      if (typeof e === 'string') {
        // Assume this is from the textarea
        if (e.length) {
          this.createData['room-descr'] = e;
        }
        return;
      }

      const targetValue = e.target.value;
      const targetID = e.target.getAttribute('id');

      if (e.target.getAttribute('type') !== null && ['radio', 'checkbox'].indexOf(e.target.getAttribute('type')) >= 0) {
        if (targetID.indexOf('room-limit') >= 0) {
          this.createData['room-limit_yes'] = '';
          this.createData['room-limit_no'] = '';
        }

        this.createData[targetID] = e.target.checked;
        return;
      }

      if (targetID === 'room-password' && (targetValue.length >= 4 && targetValue.length <= 30) && this.roomPasswordLimitError == true) {
        this.roomPasswordLimitError = false;
      }
      
      this.createData[targetID] = targetValue;
    },
    giveGenre(genres) {
      if (genres.length >= 0) {
        this.createData['room-genres'] = genres;
      }
    },
    handleRoomCreation: function() {
      // To create the room, the following is needed
      // Room Name, Room Genre(s), Room Private, Room Limit, Room Description
      let formData = {
        'room-name': this.createData['room-name'], 
        'room-genre': this.createData['room-genres'].join(', '), 
        'room-private_': this.createData['room-private'] === true,
        'password': this.createData['room-private'] === true ? this.$el.querySelector('#room-password').value : '', 
        'user-limit_': this.createData['room-limit_yes'] === true ? this.$el.querySelector('#room-limit_current').value : false, 
        'message-text': this.createData['room-descr']
      };

      // Validate form
      let focusToError = [];

      // Ensure room name has proper length
      if (this.createData['room-name'].length < 3) {
        this.roomNameError = 'Minimum Length 3 characters!';
        focusToError.push('#room-name');
      }

      if (!this.createData['room-genres'].length) {
        this.roomGenreError = true;
        focusToError.push('#room_create_modal input[aria-controls="room_genres"]');
      }

      if (this.createData['room-limit_yes'] === true && (this.$el.querySelector('#room-limit_current').value < 1 || this.$el.querySelector('#room-limit_current').value > 1000)) {
        this.roomUserLimitError = true;
        focusToError.push('#room-limit_current');
      }

      if (this.createData['room-private'] === true && (this.$el.querySelector('#room-password').value.length < 4 || this.$el.querySelector('#room-password').value.length > 30)) {
        this.roomPasswordLimitError = true;
        focusToError.push('#room-password');
      }

      if (focusToError.length) {
        focusEle(focusToError[0]);
      } else {
        db.collection('rooms').add({
          hostUID: this.$store.state.spotifyAPIData.uid,
          roomQueue: [],
          roomHistory: [],
          roomChat: [],
          roomPrivate: Boolean(formData['room-private_']),
          roomDescription: String(formData['message-text']),
          roomPassword: null,
          roomLimit: null,
          roomID: null,
        }).then((docRef) => {
          formData.docID = docRef.id;
          this.$emit('createRoom', formData);
        }).catch((error) => {
          console.error('Error has occurred! ', error); // eslint-disable-line
        });
      }
    }, 
    giveLimit: function() {
      if (this.roomUserLimitError === true && (this.$el.querySelector('#room-limit_current').value >= 1 || this.$el.querySelector('#room-limit_current').value <= 1000)) {
        this.roomUserLimitError = false;
      }
    },
    handleModalClose: function() {
      this.visible = false;
      this.$emit('closeModal', true);
      this.visible = true;
    }
  },
  computed: {
    grabGenres: function() {
      return this.$store.getters.grabGenre('');
    },
    getAllGenres: function() {
        return this.$store.state.genres.map(item => {
        const nameVal = item.replace(/\W/, '_').toLowerCase();
        return {
          name: nameVal,
          label: item,
          value: nameVal,
        };
      });
    }
  }
}
</script>

<style lang="scss">
  #room_create_modal {
    .bx--form-item.bx--form-container {
      margin-top: 25px;
    }
    .bx--modal-container {
      width: 30% !important;
      overflow: inherit;
      text-align: initial;
      max-height: 100% !important;
      .cv-text-input.bx--form-item {
        width: 100%;
      }

      .bx--room-name {
        height: 70px;
      }

      .bx--room-genre {
        height: 37px;
      }

      .room_modal_bio {
        margin-bottom: 5%;
      }

      .cv-multi-select {
        width: 100%;
        display: flex;
        justify-content: space-around;
        label {
          font-size: 0.75rem;
        }
        .bx--multi-select {
          width: 79%;
        }
        &.bx--text-input--invalid {
          .bx--multi-select {
            outline: 2px solid #da1e28;
            outline-offset: -2px;
            -webkit-box-shadow: none;
            box-shadow: none;
          }

          outline: transparent !important;
          outline-offset: initial;
          -webkit-box-shadow: initial;
          box-shadow: initial;
        }
      }

      .cv-number-input.bx--text-input--invalid {
        outline: transparent !important;
        outline-offset: initial;
        -webkit-box-shadow: initial;
        box-shadow: initial;
        #room-limit_current {
           outline: 2px solid #da1e28;
            outline-offset: -2px;
            -webkit-box-shadow: none;
            box-shadow: none;
        }
      }

      .descr_textarea, .descr_textarea .bx--form-item {
        align-items: normal !important;
        margin-top: 0px;
      }

      .bx--modal-content {
        overflow: auto;
        max-height: 100% !important;
      }
    }
    .bx--form-flex-container {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      width: 100%;
      height: 70px;
      .bx--form-item {
        align-items: normal !important;
      }
    }
  }


  form .form-group, form .checkbox-group {
    display: flex;
    justify-content: left;
  }

  .modal-dialog {
    max-width: 750px;
  }

  .lg-col {
    justify-content: space-between !important;
  }

  .input_container {
    flex-direction: column;
  }

  .input_container label {
    float: left;
  }

  .checkbox-group input {
    width: 30px;
  }

  .form-group label {
    margin-right: 20px
  }

  #room-private {
    width: 105px;
  }

  .hidden_sr { 
    height: 1px;
    width: 1px;
    left: -9001px;
    position: absolute;
    overflow: hidden;
  }

  input[type="checkbox"], input[type="radio"] {
    width: 20px !important;
  }

  .input_hidden {
    visibility: hidden;
  }

  #password_room_ {
    width: 264px;
  }

  .modal-backdrop.fade.show {
    display: none;
  }
</style>
