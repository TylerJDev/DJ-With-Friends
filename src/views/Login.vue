<template>
  <div class="login">
    <h1>Please Login</h1>
    <button v-on:click="handleAuthenticate">Login!</button>
  </div>
</template>

<script>
export default {
  name: 'login',
  methods: {
    handleAuthenticate() {
      this.$emit('auth-user');
    }
  }
}
</script>
