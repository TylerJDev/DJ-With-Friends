import { shallowMount } from '@vue/test-utils';
import Login from '@/pages/LoginPage/index.vue';
import Firebase from "firebase";
import db from '../../db.js';

// Ignores non-issues i.e, console.error logs
console.error = jest.fn();

window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
}));

describe('Login page for auth', () => {
  const $store = { state: { errorOccurred: { route: 'route' } }, dispatch: jest.fn(), commit: jest.fn() };
  const $route = { route: 'route' };

  const wrapper = shallowMount(Login, {
    mocks: {
      $store,
      $route,
    },
  });

  it('renders login panel', () => {
    const welcomeLoginMsg = 'DJ With Friends';

    // Ensure login heading is rendered properly
    expect(wrapper.find('h1').text()).toMatch(welcomeLoginMsg);

    // Ensure login button is displayed
    expect(wrapper.find('#registerBtn').isVisible()).toBe(true);
  });

  it('Check if fetch is success', () => {
    // Ensure server returns proper response ... {"https://accounts.spotify.com/authorize?"}

    fetch.mockResponseOnce('https://accounts.spotify.com/authorize?response_type=code&client_id=');

    return wrapper.vm.handleAuthenticate().then((res) => {
      expect(res).toBe(true);

      // Ensure error message has not rendered
      expect(wrapper.find('span#error').exists()).toBeFalsy();
    });
  });

  it('Check if fetch is failure', () => {
    // Ensure if server returns error, it's handled

    fetch.mockResponseOnce('Nothing!');

    return wrapper.vm.handleAuthenticate().then((res) => {
      expect(res).toBe(false);
    });
  });
});
