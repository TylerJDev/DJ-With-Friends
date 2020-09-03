import { shallowMount, mount } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import Home from '@/pages/LobbyRoomPage/index.vue';
import RoomList from '@/pages/LobbyRoomPage/RoomList.vue';
import RoomSelect from '@/pages/LobbyRoomPage/RoomSelect.vue';
import RoomUsers from '@/pages/LobbyRoomPage/RoomUsers.vue';
import RoomBio from '@/pages/LobbyRoomPage/RoomBio.vue';
import storeConfig from '@/store/index.js';
import LobbyStore from '@/store/modules/lobby.js';
import { mockData } from '@/utils/mocks/RoomList.js';


/** TO-DO
 * TEST: RoomBio => Proper amount of users in table
 * TEST: RoomVinyl => Testing vinyl cover, transitions
 * TEST: RoomSelect => Proper sort by functionality
 * TEST: RoomSelect => Proper pagination
 */

describe('Lobby rendering and functionality', () => {
  const store = storeConfig;

  it('Renders page successfully', () => {
    const wrapper = mount(Home, {
      mocks: {
        $store: store,
      },
    });

    expect(wrapper.find('h1').exists()).toBe(true);
    expect(wrapper.find('h1').text()).toBe('DJ WITH FRIENDS');
  });

  it('Modal functionality', () => {
    const wrapper = shallowMount(Home, {
      mocks: {
        $store: store,
      },
    });

    const modalTrigger = wrapper.find('#modal_create_room');
    expect(wrapper.vm.activeModal).toBeFalsy();
    modalTrigger.trigger('click');
    expect(wrapper.vm.activeModal).toBeTruthy();
  });
});

/* Room Lists */
describe('Testing RoomList component', () => {
  beforeEach(() => {
    LobbyStore.state.rooms = [{ settings: { 'room-genre': 'All ' } }, { settings: { 'room-genre': 'Hip hop' } }];
  });

  it('Genres rendering', () => {
    const $store = { state: storeConfig.state, getters: storeConfig.getters };
    const wrapper = shallowMount(RoomList, {
      propsData: {
        rooms: [],
      },
      mocks: {
        $store,
      },
    });

    const genresBtn = wrapper.find('#genres');
    expect(genresBtn.text()).toBe('All Hip hop');
  });
});

/* Room Card */
describe('Testing RoomCard component', () => {
  beforeEach(() => {
     LobbyStore.state.rooms = [{ settings: { 'room-genre': 'All ' }, users: [] }];
  });

  it('Room List rendering', () => {
    storeConfig.state.lobby.rooms.push(...mockData);
    storeConfig.commit('addToRooms', mockData);

    const wrapper = mount(RoomSelect, {
      mocks: {
        $store: storeConfig,
      },
    });

    wrapper.setData({ roomResults: [...mockData] });

    const wrapperDesc = shallowMount(RoomBio, {
      mocks: {
        $store: storeConfig,
      },
    });

    const roomName = wrapper.find('h2.room_name').text();
    expect(roomName).toContain('Tyler\'s room!');

    wrapper.find('button[data-server-id="abcdef"]').trigger('click');

    storeConfig.state.lobby.currentDisplayed = { name: '56922', users: [{ name: 'Tyler', rank: 'Host' }, { name: 'Wham', rank: 'DJ' }], settings:{ 'room-name': 'Summertime', 'message-text': 'Yes this is my room', 'room-genre': 'Hip Hop', 'room-private_': false }, timeCreated: 1587515722611, display_name: 'Tyler Jones', server_id: 'ghijkl' }

    const roomMessage = wrapperDesc.find('p.bio_description').text();
    expect(roomMessage).toBe('Yes this is my room');

    const roomGenre = wrapperDesc.find('#card_bio p.bio_genre').text();
    expect(roomGenre).toBe('Genre: Hip Hop');

    const displayName = wrapperDesc.find('#card_bio p.bio_host').text();
    expect(displayName).toBe('Host: Tyler Jones');

    const roomLink = wrapperDesc.find('a#bio_join_btn').attributes().href;
    expect(roomLink).toContain('/room/5692');

    const roomLock = wrapper.findAll('.lock').at(0).text();
    expect(roomLock).toBe('Room is Private');
  });
});

/* Room Users */
describe('Testing RoomUser component', () => {
  it('Room Card rendering', () => {
    const wrapper = shallowMount(RoomUsers, {
      propsData: {
        rooms: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    });

    expect(wrapper.find('.user_data_room .plus_users').text()).toBe('+6');
  });
});

/* Pagination */
describe('Test pagination', () => {
  Vue.use(Vuex);
  const store = new Vuex.Store(LobbyStore);

  beforeEach(() => {
    LobbyStore.state.rooms = [{ settings: { 'room-genre': 'All ' } }, { settings: { 'room-genre': 'Hip hop' } },
      { settings: { 'room-genre': 'Progressive rock' } }, { settings: { 'room-genre': 'Electro' } },
      { settings: { 'room-genre': 'Baroque music' } }, { settings: { 'room-genre': 'Classic rock' } }];
  });

  it('Page change on click', () => {
    expect(store.state.page).toEqual([1]);
    store.commit('changeCurrentPage', { page: 2 });
    expect(store.state.page).toEqual([2]);

    const wrapper = mount(RoomSelect, {
      propsData: {
        rooms: [],
      },
      mocks: {
        $store: storeConfig,
      },
    });

    expect(wrapper.find('cv-pagination').attributes().page).toContain('2');
  });

  it('Mock changing pages', () => {
    const changePage = (pageCount) => {
      storeConfig.commit('changeCurrentPage', { page: pageCount });
    };

    changePage(2);
    expect(storeConfig.state.lobby.page).toEqual([2]);

    changePage(3);
    expect(storeConfig.state.lobby.page).toEqual([3]);
  });
});
