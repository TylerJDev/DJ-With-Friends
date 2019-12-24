import Vue from 'vue'
import { mount } from '@vue/test-utils';
import Home from '@/views/Home.vue';
import store from '@/store.js';

describe('Lobby rendering and functionality', () => {
  const $store = {'state': store.state};
  const wrapper = mount(Home, {
    mocks: {
      $store,
    }
  });

  it('Renders page successfully', () => {
    expect(wrapper.find('h1').exists()).toBe(true);
    expect(wrapper.find('h1').text()).toBe('Find a room!');
  });

  it('Modal functionality', async () => {
    const modalTrigger = wrapper.find('#modal_create_room');
    const modal = wrapper.find('#room_create_modal');

    expect(modal.isVisible()).toBe(false);

    expect(wrapper.vm.activeModal).toBeFalsy();
    modalTrigger.trigger('click');

    expect(wrapper.vm.activeModal).toBeTruthy();
  })
});
