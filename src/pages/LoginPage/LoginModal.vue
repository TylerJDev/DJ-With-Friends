<template>
  <cv-modal
    :close-aria-label="closeAriaLabel"
    :size="size"
    :visible="modalVisible"
    :auto-hide-off="autoHideOff"
    @modal-hidden="closeModal"
    id="login_modal"
  >
    <template v-if="use_label" slot="label">DJ With Friends</template>
    <template v-if="use_content" slot="content">
      <div>
        <form class="mt-3" @submit.prevent="register">
          <div class="container">
            <div>
              <div>
                <div class="modal-card">
                  <div class="modal-body">
                    <h3 class="type-auth_title">{{userState === 'register' ? 'Create Account' : userState === 'login' ? 'Login' : ''}}</h3>
                    <template v-if="userState === 'register'">
                      <div class="form-row">
                        <div v-if="errorRegister" class="col-12 alert alert-danger px-3">{{ errorRegister }}</div>
                        <div class="col-12 alert alert-danger px-3" v-if="error">{{error}}</div>

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
                        />
                      </section>
                      <div class="form-row">
                        <section class="col-sm-6 form-group">
                          <input
                            class="form-control"
                            type="password"
                            placeholder="Password"
                            v-model="passOne"
                          />
                        </section>
                        <section class="col-sm-6 form-group">
                          <input
                            class="form-control"
                            type="password"
                            required
                            placeholder="Repeat Password"
                            v-model="passTwo"
                          />
                        </section>
                      </div>
                      
                      <div class="form-group justify-content-center mb-0">
                        <button class="btn btn-primary blu-btn" type="submit">Register</button>
                      </div>
                    </template>

                    <template v-if="userState === 'login'">
                      <section class="form-group">
                        <div class="col-12 alert alert-danger px-3" v-if="error">{{error}}</div>
                        <label class="form-control-label sr-only" for="Email">Email</label>
                        <input
                          required
                          class="form-control"
                          type="email"
                          id="email"
                          placeholder="Email"
                          v-model="email"
                        />
                      </section>
                      <section class="form-group">
                        <input
                          required
                          class="form-control"
                          type="password"
                          placeholder="Password"
                          v-model="password"
                        />
                      </section>
                      <div class="form-group justify-content-center mb-0">
                        <button class="btn btn-primary blu-btn" type="submit">Log in</button>
                      </div>
                    </template>
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
      </div>
    </template>
  </cv-modal>
</template>

<script>
import { focusEle } from "@/utils/focus.js";
import Firebase from "firebase";

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
      use_label: true,
      use_title: false,
      use_content: true,
      size: "small",
      autoHideOff: false,
      modalVisible: false,
      email: '',
      password: '',
      error: '',
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

      if (!this.error) {
        Firebase.auth()
          .createUserWithEmailAndPassword(info.email, info.password)
          .then(
            userCredentials => {
              return userCredentials.user.updateProfile({
                displayName: info.displayName
              }).then(() => {
                this.$router.replace('callback');
              });
            }
          ), error => {
            this.errorRegister = error.message;
          }
      }
    },
    login: function () {
      const info = {
        email: this.email,
        password: this.password,
      };

      Firebase.auth()
        .signInWithEmailAndPassword(info.email, info.password)
        .then(
          () => {
            // Run handleAuthenticate function via parent component
            // Unique identifier should be saved
            this.$emit('handle-auth');
          },
          (error) => {
            this.error = error.message;
          }
        );
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

#login_modal {
  .blu-btn {
    @include blu_btn;
    font-family: "IBM Plex Sans", sans-serif; 
  }

  h4 {
    font-family: 'Syncopate', sans-serif !important;
    font-size: 1.5rem;
    margin-top: 10px;
  }

  .bx--modal-header__heading {
    display: none;
  }

  .bx--modal-container {
    height: 500px;
    width: 100% !important;
    background-color: #e2d7ca;
    box-shadow: 3px 5px 0px 0px black;
    border: 1px solid black;

    .card.bg-light {
      border: none;
      background-color: transparent !important;
    }

    .modal-or {
      font-family: "IBM Plex Sans", sans-serif;
      font-weight: 300;
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
      box-shadow: -3px 3px 0px 0px black;
    }

    .bx--modal-header {
      h2,
      h4, h3 {
        font-family: "IBM Plex Sans", sans-serif;
      }
    }

    h2, h3, h4 {
      color: black !important;
      font-family: "IBM Plex Sans", sans-serif;
      font-weight: 600;
    }

    .type-auth_title {
      margin-bottom: 15px;
      // border: 1px solid white;
      display: inline-block;
      padding: 5px;
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