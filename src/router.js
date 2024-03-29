import Vue from 'vue';
import Router from 'vue-router';
import Store from '@/store/index.js';
import io from 'socket.io-client';
import Home from './pages/LobbyRoomPage/index.vue';
import Login from './pages/LoginPage/index.vue';
import About from './pages/AboutPage/index.vue';
import Callback from './views/Callback.vue';
import Room from './pages/UserRoomsPage/index.vue';
import NotFound from './components/NotFound.vue';

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
      meta: {
        title: 'Home',
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

        if (Store.state.passwordRoom.visible && Store.state.passwordRoom.password) {
          const roomPassword = Store.state.passwordRoom.password;
          socketConnect.emit('checkLock', { roomID: to.params.id, token: Store.state.spotifyAPIData.refreshToken, password: roomPassword });
          socketConnect.on('passwordCheck', (res) => {
            const resData = JSON.parse(res);

            if (resData.result === true) {
              connectState = true;
              Store.state.roomKey = resData.queryHash;
              Store.commit('addPasswordRoomState', {});
              next();
            } else {
              const currentPswState = Store.getters.grabPasswordRoomState;
              currentPswState.error = true;
              currentPswState.visible = true;
              Store.commit('addPasswordRoomState', currentPswState);
            }
          });
          return;
        }

        // Check if room has a password
        let roomIndex = Store.state.lobby.rooms.findIndex(
          (current) => String(current.name) === to.params.id);

        // Clear out previous key
        Store.state.roomKey = '';
        if (roomIndex === -1) {
          // Assume user went to link without hitting lobby
          // As lobby contains the store
          next('/');

          socketConnect.emit('checkLock', { roomID: to.params.id, checkRoom: true });
          socketConnect.on('lockedStatus', (res) => {
            if (res.locked === true) {
              const paramsNow = res.paramsTo === '/' ? '/' : `/room/${res.paramsTo}`;
              next(paramsNow);
              connectState = true;
            }
          });

          roomIndex = Store.state.lobby.rooms.findIndex((current) => String(current.name) === to.params.id);
        }

        if (loggedState !== null) {
          if (roomIndex >= 0) {
            connectState = true;
            if (Object.prototype.hasOwnProperty.call(Store.state.lobby.rooms[roomIndex], 'psw_index')) {
              const currentPswState = Store.getters.grabPasswordRoomState;
              currentPswState.visible = true;
              currentPswState.to = to.params.id;

              Store.commit('addPasswordRoomState', currentPswState);
            } else {
              next();
            }
          }

          const limit = 5;
          let timerTicker = 0;

          const checkConnect = setInterval(() => {
            if (connectState === true || socketConnect.connect === true || timerTicker >= limit) {
              clearInterval(checkConnect);
              if (!connectState && timerTicker >= limit) {
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
      meta: {
        title: 'Room',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        title: 'About',
      },
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
      meta: {
        title: '',
      },
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback,
      meta: {
        title: 'Loading',
      },
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound,
      meta: {
        title: 'Page Not Found',
      },
    },
  ],
});
