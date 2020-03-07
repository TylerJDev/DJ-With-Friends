import { shallowMount, mount } from '@vue/test-utils';
import Vue from 'vue'
import Vuex from 'vuex'
import Home from '@/pages/LobbyRoomPage/index.vue';
import RoomList from '@/pages/LobbyRoomPage/RoomList.vue';
import RoomCard from '@/pages/LobbyRoomPage/RoomCard.vue';
import RoomUsers from '@/pages/LobbyRoomPage/RoomUsers.vue';
import store from '@/store/index.js';
import LobbyStore from '@/store/modules/lobby.js';


/* Lobby Index */
describe('Lobby rendering and functionality', () => {
  it('Renders page successfully', () => {
    const $store = {'state': store.state, 'getters': store.getters};
    const wrapper = mount(Home, {
      mocks: {
        $store,
      }
    });

    expect(wrapper.find('h1').exists()).toBe(true);
    expect(wrapper.find('h1').text()).toBe('DJWithFriends.');
  });

  it('Modal functionality', () => {
    const $store = {'state': store.state, 'getters': store.getters};
    const wrapper = shallowMount(RoomList, {
      propsData: {
        rooms: []
      },
      mocks: {
        $store,
      }
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
    LobbyStore.state.rooms = [{'settings': { 'room-genre': 'All ' }}, {'settings': { 'room-genre': 'Hip hop'}}];
  });

  it('Genres rendering', () => {
    const $store = {'state': store.state, 'getters': store.getters};
    const wrapper = shallowMount(RoomList, {
      propsData: {
        rooms: []
      },
      mocks: {
        $store
      }
    });
    
    const genres_btn = wrapper.find('#genres');
    expect(genres_btn.text()).toBe('All Hip hop');
  });
});

/* Room Card */
describe('Testing RoomCard component', () => {
  beforeEach(() => {
    LobbyStore.state.rooms = [{'settings': { 'room-genre': 'All ' }, 'users': []}]
  });

  it('Room List rendering', () => {
    const wrapper = shallowMount(RoomCard, {
      propsData: {
        rooms: {
          settings: {
            'room-name': 'Name_1',
            'message-text': 'Message_text_1',
            'room-genre': 'Hip hop',
            'room-private_': true
          },
          'display_name': 'User_1',
          'name': 5692,
        }
      }
    });

    const roomName = wrapper.find('h2').text();
    expect(roomName).toBe('Name_1');

    const roomMessage = wrapper.find('p.room_description').text();
    expect(roomMessage).toBe('Message_text_1');

    const roomGenre = wrapper.find('.room_meta > p.room_genre').text();
    expect(roomGenre).toBe('Genre: Hip hop');

    const displayName = wrapper.find('h3.room_display_name').text();
    expect(displayName).toBe('Host: User_1');

    const roomLink = wrapper.find('a.room_link').attributes().href;
    expect(roomLink).toBe('/room/5692');

    const roomLock = wrapper.find('.room-lock').text();
    expect(roomLock).toBe('Private');
  });
});

/* Room Users */
describe('Testing RoomUser component', () => {
  it('Room Card rendering', () => {
    const wrapper = shallowMount(RoomUsers, {
      propsData: {
        rooms: [1, 2, 3, 4, 5, 6, 7, 8, 9]
      }
    });
    
    expect(wrapper.find('.user_data_room .plus_users').text()).toBe('+6');
  });
});

/* Pagination */
describe('Test pagination', () => {
  Vue.use(Vuex);
  const store = new Vuex.Store(LobbyStore);

  beforeEach(() => {
    LobbyStore.state.rooms = [{'settings': { 'room-genre': 'All ' }}, {'settings': { 'room-genre': 'Hip hop'}},
    {'settings': { 'room-genre': 'Progressive rock' }}, {'settings': { 'room-genre': 'Electro'}},
    {'settings': { 'room-genre': 'Baroque music' }}, {'settings': { 'room-genre': 'Classic rock'}}];
  });

  it('Page change on click', () => {
    expect(store.state.page).toEqual([1]);
    store.commit('changeCurrentPage', {page: 2});
    expect(store.state.page).toEqual([2]);

    const wrapper = mount(RoomList, {
      propsData: {
        rooms: []
      },
      mocks: {
        $store: {
          'state': {
            'lobby': store.state
          }, 
          'getters': store.getters,
        }
      }
    });

    expect(wrapper.find('.current_page').text()).toBe('2');
    expect(wrapper.text()).toContain('Genre: Classic rock');
    expect(wrapper.text()).not.toContain('Genre: Hip hop');

    store.commit('changeCurrentPage', {page: 1});
    expect(wrapper.find('.current_page').text()).toBe('1');
    expect(wrapper.text()).toContain('Genre: Electro');
    expect(wrapper.text()).not.toContain('Genre: Classic rock');
  });

  it('Page change on click of pagination controls', () => {
    const wrapper = mount(RoomList, {
      propsData: {
        rooms: []
      },
      mocks: {
        $store: {
          'state': {
            'lobby': store.state
          }, 
          'getters': store.getters,
          'commit': store.commit
        }
      }
    });

    const nextControl = wrapper.find('#next_control');
    nextControl.trigger('click');
    expect(wrapper.find('.current_page').text()).toBe('2');
    nextControl.trigger('click');
    expect(wrapper.find('.current_page').text()).toBe('2');

    const prevControl = wrapper.find('#prev_control');
    prevControl.trigger('click');
    expect(wrapper.find('.current_page').text()).toBe('1');
    prevControl.trigger('click');
    expect(wrapper.find('.current_page').text()).toBe('1');
  });
});
