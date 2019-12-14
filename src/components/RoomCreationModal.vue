<template>
  <div id="room_create_modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <form>
            <div class="form-group lg-col">

              <div class="input_container">
                <label for="room-name" class="col-form-label">Room Name:</label>
                <input type="text" class="form-control" id="room-name">
              </div>

              <div class="input_container">
                <label for="room-genre" class="col-form-label">Genre:</label>
                <input type="text" class="form-control" id="room-genre">
              </div>
            </div>

            <div class="form-group form-left">
              <div class="checkbox-group">
                <label id="room-private" class="col-form-label">Private Room:</label>
                <input type="checkbox" class="form-control" id="room-private_" value="Yes" aria-describedby="room-private" name="private-room">
                <label for="room-private_yes" class="col-form-label hidden_sr">Yes</label>
              </div>
            </div>

            <div class="form-group lg-col">
              <label for="room-limit" class="col-form-label" id="room-limit-label">Room Limit:</label>
              <!-- <input type="text" class="form-control" id="room-limit"> -->

              <div id="radio_container" class="hidden_sr" v-on:change="roomLimit">
                <input type="radio" class="form-control" id="room-limit-yes" value="Yes" aria-describedby="room-limit-label" name="room-limit">
                <input type="radio" class="form-control" id="room-limit-no" value="No" aria-describedby="room-limit-label" name="room-limit">
              </div>

              <div id="btn_container" v-on:click.prevent="roomLimit">
                <button id="room-limit-yes_btn" value="Yes" tabindex="-1">Yes</button>
                <button id="room-limit-no_btn" value="No" tabindex="-1">No</button>
              </div>

              <div id="room_limit" v-bind:class="[room_limit ? '' : 'input_hidden']">
                <label for="user-limit_" class="col-form-label">User Limit:</label>
                <input type="number" name="user-limit" id="user-limit_" min="1">
              </div>

            </div>

            <div class="form-group">
              <label for="message-text" class="col-form-label">Description:</label>
              <textarea class="form-control" id="message-text"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="handleRoomCreation" data-dismiss="modal">Send message</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input_types: ['room-name', 'room-genre', 'room-private_', 'user-limit_', 'message-text'],
      room_limit: false,
    }
  },
  methods: {
    handleRoomCreation: function() {
      const formData = {};

      for (let current in this.input_types) {
        formData[this.input_types[current]] = this.$el.querySelector(`#${this.input_types[current]}`).value;

        if (this.input_types[current].indexOf('_') >= 0 && this.input_types[current] !== 'user-limit_') {
          formData[this.input_types[current]] = this.$el.querySelector(`#${this.input_types[current]}`).checked;
        }

        if (formData[this.input_types[current]] === '' && this.input_types[current].indexOf('_') === -1) {
          let invalidTypes = this.input_types.filter(curr => formData.hasOwnProperty(curr) !== true);
          let invalidElems = this.$el.querySelectorAll('#' + invalidTypes.join(', #'));

          Array.from(invalidElems, (curr) => curr.classList.add('is-invalid'));
          return false;
        }
      }
      this.$emit('createRoom', formData);
    }, roomLimit(e) {
      Array.from(this.$el.querySelector('#btn_container').children, (curr) => curr.classList.remove('btn-primary'));

      this.room_limit = e.target.value === 'Yes';

      let targetCurrent = e.target.attributes['id'].value.indexOf('btn') === -1 ? document.querySelector(`#${e.target.attributes['id'].value}_btn`) : e.target;
      targetCurrent.classList.add('btn-primary');
    }
  },
}
</script>

<style scoped>
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
</style>
