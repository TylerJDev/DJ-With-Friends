import { shallowMount } from '@vue/test-utils';
import Vue from 'vue'
import Vuex from 'vuex'
import RoomNavbar from '@/pages/UserRoomsPage/RoomNavbar.vue';
import NotificationAlert from '@/components/NotificationAlert.vue';
import storeConfig from '@/store/modules/rooms.js';

describe('Navbar functionality', () => {
    Vue.use(Vuex);
    const store = new Vuex.Store(storeConfig);

    it('Test notification alert', () => {
        store.commit('notifyUsers', {"message": "User Joined", "name": "TJ", "timeJoined": 1585268485956, "type": "info"});
        const wrapper = shallowMount(NotificationAlert, {
            mocks: {
                $store: store,
            }
        });

        expect(wrapper.find('#sr-notify-topic').text()).toContain('User Joined');
    });
});