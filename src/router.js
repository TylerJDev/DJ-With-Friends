import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Store from './store.js'
import About from './views/About.vue'
import Callback from './views/Callback.vue'
import Room from './views/Room.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from, next) => {
        const loggedState = Store.state.spotifyAPIData.refreshToken;
        if (loggedState !== null) {
          next();
        } else {
          next("login");
        }
      }
    },
    {
      path: '/room/:id',
      name: 'room',
      component: Room,
      beforeEnter: (to, from, next) => {
        const loggedState = Store.state.spotifyAPIData.refreshToken;
        if (loggedState !== null) {
          next();
        } else {
          next("login");
        }
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      beforeEnter: (to, from, next) => {
        const loggedState = Store.state.spotifyAPIData.refreshToken;
        if (loggedState !== null) {
          next();
        } else {
          next("login");
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        const loggedState = Store.state.spotifyAPIData.refreshToken;
        if (loggedState) {
          next("/");
        } else {
          next();
        }
      }
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback
    },
  ],
})
