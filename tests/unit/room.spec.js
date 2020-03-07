import { shallowMount} from '@vue/test-utils';
import Vue from 'vue'
import Vuex from 'vuex'
import storeConfig from '@/store/modules/rooms.js';
import Player from '@/pages/UserRoomsPage/RoomPlayer.vue';

describe('Test main region', () => {
    Vue.use(Vuex);
    const store = new Vuex.Store(storeConfig);
    
    it('Heading(s) is given song name', () => {
        store.commit('addCurrentTrack', {'track': 'Runaway!', 'album': 'Deee-Lite', 'queue': [1]});
        const wrapper = shallowMount(Player, {
            mocks: {
                $store: store,
            },
            propsData: {
                currentTrackPlaying: {'track': ''}
            }
        });

        expect(wrapper.find('h1').text()).toBe('Runaway!');
        expect(wrapper.find('h2').text()).toBe('Deee-Lite');
    });

    it('H1 to contain default text if no track', () => {
        store.commit('addCurrentTrack', {'track': '', 'album': '', 'queue': [1]});
        const wrapper = shallowMount(Player, {
            mocks: {
                $store: store
            },
            propsData: {
                currentTrackPlaying: {'track': ''}
            }
        });

        expect(wrapper.find('h1').text()).toBe('');
    });

    it('Progress bar has correct time', () => {
        store.commit('setCurrentProgress', {'seconds': 50});
        const wrapper = shallowMount(Player, {
            mocks: {
                $store: store
            },
            propsData: {
                currentTrackPlaying: {'track': ''}
            }
        });

        expect(wrapper.find('p.initial').text()).toBe('0:50');

    });
});
