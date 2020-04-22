import { shallowMount } from '@vue/test-utils';
import NotificationAlert from '@/components/NotificationAlert.vue';
import mainStore from '@/store/index.js';

describe('Navbar functionality', () => {
  it('Test notification alert', () => {
    mainStore.commit('notifyUsers', {
      message: 'User Joined', name: 'TJ', timeJoined: 1585268485956, type: 'info',
    });
    const wrapper = shallowMount(NotificationAlert, {
      mocks: {
        $store: mainStore,
      },
    });

    expect(wrapper.find('#sr-notify-topic').text()).toContain('User Joined');
  });
});
