import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/LobbyRoomPage/index.vue'
import Login from './pages/LoginPage/index.vue'
import Store from '@/store/index.js';
import About from './pages/AboutPage/index.vue'
import Callback from './views/Callback.vue'
import Room from './pages/UserRoomsPage/index.vue'
import io from 'socket.io-client'

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
        const socketConnect = io.connect(Store.state.location + 'rooms');

        if (loggedState !== null) {
          socketConnect.emit('checkLock', {'roomID': to.params.id, 'token': Store.state.spotifyAPIData.refreshToken});
          socketConnect.on('lockedRoom', (data) => {
            if (data.hasOwnProperty('userLimit')) {
              Store.dispatch('handleNotification', {'timeout': 10000, 'type': 'error', 'initialised': true, 'title': 'Room User Limit Reached', 'subtitle': 'The current room is full!'});
              next('/');
            } else if (data.passwordProtected === false) {
              next();
            } else {
              let passwordInput;

              if (Store.state.spotifyAPIData.refreshToken === data.token) {
                next();
              } else {
                passwordInput = prompt('What is the secret secret password?');
                socketConnect.emit('checkLock', {'roomID': to.params.id, 'password': passwordInput});
              }

              socketConnect.on('passwordCheck', (res) => {
                if (res) {
                  next();
                } else {
                  next('/');
                  Store.dispatch('handleNotification', {'timeout': 10000, 'type': 'error', 'initialised': true, 'title': 'Incorrect Password', 'subtitle': 'The password was incorrect!'});
                }
              });
            }
          });
        } else {
          next("login");
        }
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
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
