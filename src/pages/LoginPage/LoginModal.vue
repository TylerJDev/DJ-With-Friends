<template>
  <cv-modal
    :close-aria-label="closeAriaLabel"
    :size="size"
    :visible="modalVisible"
    :auto-hide-off="autoHideOff"
    @modal-hidden="closeModal"
    id="login_modal"
  >
    <template v-if="use_title" slot="title">DJ <br/><span class="logo-color">With</span> <br/>Friends</template>
    <template v-if="use_label" slot="label">Let's DJ!</template>
    <template v-if="use_content" slot="content">
      <div>
        <form class="mt-3" :data-modal-auth-type="userState === 'register' ? 'register' : 'login'" @submit.prevent="handleModalAuthType">
          <div class="container">
            <div>
              <div>
                <div class="modal-card">
                  <div class="modal-body">
                    <fieldset>
                      <legend class="type-auth_title">{{userState === 'register' ? 'Create Account' : userState === 'login' ? 'Login' : ''}}</legend>
                      <template v-if="userState === 'register'">
                        <div class="form-row">
                          <div class="error_container" v-if="errorRegister || errorAuth">
                            <div class="col-12 alert alert-danger px-3" role="alert">{{ errorRegister || errorAuth }}</div>
                          </div>

                          <section class="col-sm-12 form-group">
                            <label class="form-control-label sr-only" for="displayName">Display Name</label>
                            <input
                              class="form-control"
                              type="text"
                              id="displayName"
                              placeholder="Display Name"
                              name="displayName"
                              required
                              v-model="displayName"
                              autocomplete="username"
                              v-on:blur="handleDisplayInput"
                            />
                          </section>
                        </div>
                        <section class="form-group">
                          <label class="form-control-label sr-only" for="emailRegister">Email</label>
                          <input
                            class="form-control"
                            type="email"
                            id="emailRegister"
                            placeholder="Email Address"
                            required
                            name="email"
                            v-model="emailRegister"
                            autocomplete="email"
                          />
                        </section>
                        <div class="form-row">
                          <section class="col-sm-6 form-group">
                            <input
                              class="form-control"
                              type="password"
                              required
                              placeholder="Password"
                              v-model="passOne"
                              autocomplete="off"
                              id="password-1"
                            />
                          </section>
                          <section class="col-sm-6 form-group">
                            <input
                              class="form-control"
                              type="password"
                              required
                              placeholder="Repeat Password"
                              v-model="passTwo"
                              autocomplete="off"
                              id="password-2"
                            />
                          </section>
                        </div>
                        
                        <div class="form-group justify-content-center mb-0">
                          <button class="btn btn-primary blu-btn submit-auth" type="submit">Register</button>
                        </div>
                      </template>

                      <template v-if="userState === 'login'">
                        <section class="form-group">
                          <div class="error_container" v-if="error || errorAuth">
                            <div class="col-12 alert alert-danger px-3">{{error || errorAuth}}</div>
                          </div>
                          <label class="form-control-label sr-only" for="loginEmail">Email</label>
                          <input
                            required
                            class="form-control"
                            type="email"
                            id="loginEmail"
                            placeholder="Email"
                            v-model="email"
                            autocomplete="email"
                          />
                        </section>
                        <section class="form-group">
                          <label class="form-control-label sr-only" for="loginPassword">Password</label>
                          <input
                            required
                            class="form-control"
                            type="password"
                            id="loginPassword"
                            placeholder="Password"
                            v-model="password"
                            autocomplete="current-password"
                          />
                        </section>
                        <div class="form-group justify-content-center mb-0">
                          <button class="btn btn-primary blu-btn submit-auth" type="submit">Log in</button>
                        </div>
                      </template>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <p class="text-center mt-2 modal-or">
          {{userState === 'register' ? 'Already have an account?' : userState === 'login' ? 'Don\'t have an account yet?' : ''}}
          <button v-on:click="changeUserState" class="modal-or_btn" :data-auth-type="userState === 'register' ? 'login' : 'register'">{{userState === 'register' ? 'Login' : 'Register'}}</button>
        </p>
        <p class="text-center mt-2 modal-or">
          Want to try DJ With Friends as a guest?
          <a class="continue-guest-link" href="#" @click="handleGuestAuth">Continue as guest</a>
        </p>
      </div>
    </template>
  </cv-modal>
</template>

<script>
import { focusEle } from "@/utils/focus.js";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

export default {
  name: "LoginModal",
  props: {
    modalActive: {
      type: Boolean,
      default: false,
    },
    modalEventType: {
      type: String
    }
  },
  data() {
    return {
      closeAriaLabel: "Close",
      use_label: false,
      use_title: true,
      use_content: true,
      size: "small",
      autoHideOff: false,
      modalVisible: false,
      email: '',
      password: '',
      error: '',
      errorAuth: '',
      userState: 'login',
      displayName: null,
      passOne: null,
      passTwo: null,
      emailRegister: null,
      errorRegister: null,
    };
  },
  watch: {
    passTwo: function() {
      if (this.passOne !== '' && this.passTwo !== '' && this.passTwo !== this.passOne) {
        this.errorRegister = 'Passwords must match!';
      } else {
        this.errorRegister = null;
      }
    },
    modalActive: function(v) {
      this.modalVisible = v;

      // If active, assume modalEventType is present && modal is active
      if (this.modalVisible)
        this.userState = this.modalEventType;
    },
    displayName: function() {
      const alphaNum = RegExp('^[a-zA-Z0-9_]*$', 'g');

      if (!alphaNum.test(this.displayName)) {
        this.errorRegister = 'Display Name must only contain alphanumeric characters!'
      } else {
        this.errorRegister = null;
      }
    },
    errorFromStore(newErr, oldErr) {
      if (newErr) {
        this.errorAuth = newErr;
      }
    },
  },
  computed: {
    errorFromStore() {
      return this.$store.getters.errorAtStore;
    },
  },
  methods: {
    closeModal: function () {
      this.modalVisible = false;
      this.$emit('handle-modal', {'state': false});
      // focusEle("#need_help");
    },
    changeUserState: function(e) {
      if (e.target !== undefined || e.target !== null) {
        this.userState = e.target.dataset.authType;
      }
    },
    register: function() {
      const info = {
        email: this.emailRegister,
        password: this.passOne,
        displayName: this.displayName
      }
      
      this.$store.state.loading = true;

      if (!this.error && this.errorRegister === null) {
        this.$store.dispatch('registerNewUser', info);
      } else {
        this.errorRegister = this.error.length ? this.error : 'Display Name must only contain alphanumeric characters!';
        this.$store.state.loading = false;
      }
    },
    handleModalAuthType: function(e) {
      const authType = e.target.dataset.modalAuthType;

      if (authType === 'login') {
        return this.login();
      } else if (authType === 'register') {
        return this.register();
      }
    },
    login: function () {
      const info = {
        email: this.email,
        password: this.password,
      };

      this.$store.state.loading = true;

      try {
        firebase.auth()
          .signInWithEmailAndPassword(info.email, info.password)
          .then(
            () => {
              // Run handleAuthenticate function via parent component
              // Unique identifier should be saved
              this.$emit('handle-auth');
            },
            (error) => {
              const errorMsg = error.message.includes('or the user does not') ? 'The password is invalid or the email/username is incorrect!' : error.message;
              this.error = errorMsg;
            }
          ).finally(() => {
            this.$store.state.loading = false;
          });
      } catch (error) {
        console.error(error);
        this.$store.state.loading = false;
        this.error = error.message || 'An error has occurred! Please make note of the logged error in the console.'
      }
    },
    handleDisplayInput: function(e) {
      const inputVal = e.target.value.trim();

      if (inputVal.length <= 3) {
        this.errorRegister = 'Display Name must be more than 3 characters!';
      }
    },
    handleGuestAuth() {
      this.$emit('handle-guest');
    }
  }
};
</script>

<style lang="scss">
#footer_links {
  bottom: 0;
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  margin-bottom: 10px;
  a {
    @include help_link;
  }

  #need_help {
    border: none;
    background-color: transparent;
    color: white;

    @include help_link;
  }
}

@media (max-width: $breakpoint--03) {
  #login_modal .bx--modal-container {
    margin: 5px;
    height: 100% !important;
    width: 90% !important;
    .bx--modal-header > h2 {
      font-size: 1.3rem !important;
    }
    .bx--modal-content {
      .type-auth_title {
        font-size: 1.3rem !important;
        margin-bottom: 5px !important;
      }
    }
    .submit-auth {
      margin-top: 0px !important;
      font-size: 1.3rem !important;
    }
  }
}

.dark #login_modal .bx--modal-container {
  background-color: white;
  h3, h4, legend { 
    color: black !important;
  }

  .bx--modal-close {
    box-shadow: 2px 3px 0px black;
    margin: 15px;
    border: 2px solid black;
    > svg {
      fill: black !important;
    }
  }
}

#login_modal p.bx--modal-header__heading {
  text-align: left;
  font-family: 'Syncopate', sans-serif !important;
  font-size: 1.5rem !important;
  color: black !important;
  .logo-color {
    color: $logo--color;
  }
}

.mt-3 {
  margin-top: 0px !important;
}

#login_modal {
  .error_container {
    width: 100%;
    margin-bottom: 0px;
    margin-top: 10px;
    div {
      border-radius: 0%;
      border: 1px solid black;
      box-shadow: 2px 3px 0px 0px black;
      font-family: "IBM Plex Sans", sans-serif; 
      font-weight: 500;
    }
  }

  input:focus {
    outline: blue auto 2px;
  }


  button[type="submit"] {
    &:focus {
      border: 1px dashed white !important;
      text-decoration: underline;
    }
  }

  .alert-danger {
    font-weight: bold;
  }

  section.form-group {
    flex-direction: column;
  }

  .blu-btn {
    @include blu_btn;
    font-family: "IBM Plex Sans", sans-serif; 
    width: 100%;
    font-weight: 700;
  }

  h4 {
    font-family: 'Syncopate', sans-serif !important;
    font-size: 1.5rem;
    margin-top: 10px;
  }

  .bx--modal-container {
    height: 620px;
    width: 470px;
    background-color: #e2d7ca;
    box-shadow: 9px 12px 0px 0px black;
    border: 2px solid black;

    .card.bg-light {
      border: none;
      background-color: transparent !important;
    }

    .modal-or {
      font-family: "IBM Plex Sans", sans-serif;
      font-weight: 300;
      color: #0e0e0e !important;
      a {
        color: $logo--color;
        font-weight: normal;
        text-decoration: underline;
      }
    }

    .modal-or_btn {
      @include blu_btn;
      font-size: 1rem;
      margin: 5px;
      background-color: black;
      box-shadow: -2px 3px 0px 0px black;
    }

    input {
      border-radius: 0%;
      border: 1px solid black;
    }

    .bx--modal-header {
      h2,
      h4, h3 {
        font-family: "IBM Plex Sans", sans-serif;
      }
    }

    h2, h3, h4, .type-auth_title {
      color: black !important;
      font-family: "IBM Plex Sans", sans-serif;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .type-auth_title {
      margin-bottom: 15px;
      // border: 1px solid white;
      display: inline-block;
      padding: 5px;
      color: white;
      font-size: 2rem;
      font-weight: 700;
      text-align: left;
      // box-shadow: 3px 5px 0px 0px black;
      // background-color: black;
      // color: white !important;
    }

    #main_bio_modal {
      margin-bottom: 20px;
    }
    .bx--modal-content,
    .bx--modal-header,
    .bx--accordion__content {
      padding-right: 10px !important;
      padding-left: 10px !important;
    }
  }
  .alert {
    display: block;
  }
}
</style>