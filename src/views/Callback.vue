<template>
  <div class="Callback">
    <h1>Callback!</h1>
  </div>
</template>

<script>
export default {
  name: 'login',
  beforeCreate() {
    // Current query string => ?code= ...
    var currentURL = window.location.search; 
    this.$store.dispatch('auth', {urlCurrent: currentURL, callbackURL: '/', callToAPI: 'callback'}).then(res => {
      this.$router.push(res.redirect); // Go to homepage
    });
  }
}
</script>