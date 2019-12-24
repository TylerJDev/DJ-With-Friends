<template>
  <div>
      <h2>Current Users</h2>
      <ul id="current-users">
          <li v-for="(current, index) in getUsers" v-bind:key="index">{{ current }}</li>
      </ul>
  </div>
</template>

<script>
import userListStore from '../components/store/store.js'

export default {
  props: {
    currentUsers: Array
  },
  computed: {
    getUsers: function() {
      // 1. Retrieve users; store => data => users
      return userListStore.state.users;
    }
  }
}
</script>