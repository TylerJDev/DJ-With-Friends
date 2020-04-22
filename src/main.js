import Vue from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import store from '@/store/index.js';
import 'carbon-components/css/carbon-components.css';
import CarbonComponentsVue from '@carbon/vue/src/index';
import { CarbonIconsVue } from '@carbon/icons-vue';
import UserAvatar20 from '@carbon/icons-vue/es/user--avatar/20.js';
import AppSwitcher20 from '@carbon/icons-vue/es/app-switcher/20.js';
import Notification20 from '@carbon/icons-vue/es/notification/20.js';
import AddFilled16 from '@carbon/icons-vue/es/add--filled/16.js';
import Favorite16 from '@carbon/icons-vue/es/favorite/16.js';
import InformationFilled16 from '@carbon/icons-vue/es/information--filled/16.js';
import CheckedFilled16 from '@carbon/icons-vue/es/checkmark--filled/16.js';
import TrashCan16 from '@carbon/icons-vue/es/trash-can/16.js';
import Search16 from '@carbon/icons-vue/es/search/16.js';
import Close16 from '@carbon/icons-vue/es/close/16.js';
import router from './router';

Vue.use(CarbonComponentsVue);
Vue.use(CarbonIconsVue, {
  components: {
    UserAvatar20,
    AppSwitcher20,
    Notification20,
    AddFilled16,
    Favorite16,
    InformationFilled16,
    CheckedFilled16,
    TrashCan16,
    Search16,
    Close16,
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
