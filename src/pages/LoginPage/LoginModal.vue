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
    <template v-if="use_title" slot="title">Quick Help</template>
    <template v-if="use_content" slot="content">
      <div v-if="userState.toLowerCase() === 'log in'">
        <form class="mt-3" @submit.prevent="login">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-6">
                <div class="card bg-light">
                  <div class="card-body">
                    <h3 class="font-weight-light mb-3">Log in</h3>
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
                    <div class="form-group text-right mb-0">
                      <button class="btn btn-primary" type="submit">Log in</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <p class="text-center mt-2">
          or
          <button v-on:click="changeUserState">register</button>
        </p>
      </div>
      <div v-if="userState.toLowerCase() === 'register'">
        <form class="mt-3" @submit.prevent="register">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-8">
                <div class="card bg-light">
                  <div class="card-body">
                    <h3 class="font-weight-light mb-3">Register</h3>
                    <div class="form-row">
                      <div v-if="errorRegister" class="col-12 alert alert-danger px-3">{{ errorRegister }}</div>
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
                    <div class="form-group text-right mb-0">
                      <button class="btn btn-primary" type="submit">Register</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <p class="text-center mt-2">
          or
          <button v-on:click="changeUserState">login</button>
        </p>
      </div>
    </template>
  </cv-modal>
</template>

<script>
import { focusEle } from "@/utils/focus.js";
// import Firebase from "firebase";

export default {
  name: "LoginModal",
  data() {
    return {
      closeAriaLabel: "Close",
      use_label: true,
      use_title: true,
      use_content: true,
      size: "small",
      autoHideOff: false,
      modalVisible: false,
      email: '',
      password: '',
      error: '',
      userState: 'log in',
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
    }
  },
  methods: {
    showModal: function () {
      this.modalVisible = this.modalVisible === true ? false : true;
    },
    closeModal: function () {
      this.modalVisible = false;
      // focusEle("#need_help");
    },
    changeUserState: function(e) {
      if (e.target !== undefined || e.target !== null) {
        this.userState = e.target.textContent.trim();
      }
    },
    register: function() {
      const info = {
        email: this.emailRegister,
        password: this.passOne,
        displayName: this.displayName
      }

      // if (!this.error) {
      //   Firebase.auth()
      //     .createUserWithEmailAndPassword(info.email, info.password)
      //     .then(
      //       userCredentials => {
      //         return userCredentials.user.updateProfile({
      //           displayName: info.displayName
      //         }).then(() => {
      //           this.$router.replace('about');
      //         });
      //       }
      //     ), error => {
      //       this.errorRegister = error.message;
      //     }
      // }
    },
    login: function () {
      const info = {
        email: this.email,
        password: this.password,
      };

      // Firebase.auth()
      //   .signInWithEmailAndPassword(info.email, info.password)
      //   .then(
      //     () => {
      //       this.$router.push("about");
      //     },
      //     (error) => {
      //       this.error = error.message;
      //     }
      //   );
    }
  },
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
  .bx--modal-container {
    height: 500px;
    width: 100% !important;
    background-color: whitesmoke;
    box-shadow: 3px 5px 0px 0px black;
    .bx--modal-header {
      h2,
      h4 {
        font-family: "IBM Plex Sans", sans-serif;
      }
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