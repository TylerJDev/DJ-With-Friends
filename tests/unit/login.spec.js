import { shallowMount } from '@vue/test-utils';
import Login from '@/views/Login.vue';

describe('Login page for auth', () => {
  const wrapper = shallowMount(Login);
  it('renders login panel', () => {
    let welcomeLoginMsg = 'Please Login';

    // Ensure login heading is rendered properly
    expect(wrapper.find('h1').text()).toMatch(welcomeLoginMsg);

    // Ensure login button is displayed
    expect(wrapper.find('#loginBtn').isVisible()).toBe(true);
  });

  it('triggering button returns response', () => {

    // Ensure button calls server
    // wrapper.find('button').trigger('click');

    // Ensure server returns proper response ... {"https://accounts.spotify.com/authorize?"}

    fetch.mockResponseOnce('https://accounts.spotify.com/authorize?');

    wrapper.vm.handleAuthenticate().then(res => {
      expect(res).toBe(true);
    });

    // Ensure if server returns error, it's handled 
    wrapper.vm.handleAuthenticate().then(res => {
      expect(res).toBe(false);
    });
  });
});
