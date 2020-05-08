import Vue from 'vue';
import Router from 'vue-router';
import Store from '@/store/index.js';
import io from 'socket.io-client';
import Home from './pages/LobbyRoomPage/index.vue';
import Login from './pages/LoginPage/index.vue';
import About from './pages/AboutPage/index.vue';
import Callback from './views/Callback.vue';
import Room from './pages/UserRoomsPage/index.vue';

Vue.use(Router);

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
          next('login');
        }
      },
    },
    {
      path: '/room/:id',
      name: 'room',
      component: Room,
      beforeEnter: (to, from, next) => {
        const loggedState = Store.state.spotifyAPIData.refreshToken;
        const socketConnect = io.connect(`${Store.state.location}rooms`);
        let connectState = false;

        if (loggedState !== null) {
          socketConnect.emit('checkLock', { roomID: to.params.id, token: Store.state.spotifyAPIData.refreshToken });
          socketConnect.on('lockedRoom', (data) => {
            connectState = true;
            if (data.hasOwnProperty('userLimit')) {
              Store.dispatch('handleNotification', {
                timeout: 10000, type: 'error', initialised: true, title: 'Room User Limit Reached', subtitle: 'The current room is full!',
              });
              next('/');
            } else if (data.passwordProtected === false) {
              next();
            } else {
              let passwordInput;

              if (Store.state.spotifyAPIData.refreshToken === data.token) {
                next();
              } else {
                passwordInput = prompt('What is the secret secret password?');
                socketConnect.emit('checkLock', { roomID: to.params.id, password: passwordInput });
              }

              socketConnect.on('passwordCheck', (res) => {
                if (res) {
                  next();
                } else {
                  next('/');
                  Store.dispatch('handleNotification', {
                    timeout: 10000, type: 'error', initialised: true, title: 'Incorrect Password', subtitle: 'The password was incorrect!',
                  });
                }
              });
            }
          });
          let timerTicker = 0;

          const checkConnect = setInterval(() => {
            if (connectState === true || socketConnect.connect === true || timerTicker >= 5) {
              clearInterval(checkConnect);
              if (!connectState && timerTicker >= 10) {
                const locationCurrent = Store.state.location;
                next('/');
                Store.dispatch('handleNotification', {
                  timeout: 10000, type: 'error', initialised: true, title: 'Could not find room', subtitle: `Could not find room ${locationCurrent}`,
                });
              }
            } else {
              timerTicker += 1;
            }
          }, 2500);
        } else {
          next('login');
        }
      },
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
          next('/');
        } else {
          next();
        }
      },
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback,
    },
  ],
});
