import { shallowMount, mount } from '@vue/test-utils';
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
    expect(wrapper.find('h1').text()).toBe('Join a room with friends, or strangers.');
  });

  it('Modal functionality', () => {
    const wrapper = shallowMount(RoomList, {
      propsData: {
        rooms: []
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
    const wrapper = shallowMount(RoomList);
    
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
    
    expect(wrapper.find('.user_data_room .plus_users').text()).toBe('+5');
  });
});