import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'
import store from './store'

// import VueSocketIO from 'vue-socket.io'
//
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'http://localhost:3000/',
//   vuex: {
//     store,
//     options: {
//       useConnectionNamespace: true
//     },
//     actionPrefix: 'SOCKET_',
//     mutationPrefix: 'SOCKET_'
//   }
// }));
//
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'http://localhost:3000/rooms',
//   vuex: {
//     store,
//     options: {
//       useConnectionNamespace: true
//     },
//     actionPrefix: 'SOCKET_DOUBLE',
//     mutationPrefix: 'SOCKET_DOUBLE'
//   }
// }));

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
