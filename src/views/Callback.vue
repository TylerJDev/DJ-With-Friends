<template>
  <div id="callback_container">
    <div class="loading_container" role="alert">
      <i class="fas fa-circle-notch"></i>
      <span class="hide_sr">Loading Application ... </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  beforeCreate() {
    // Current query string => ?code= ...
    var currentURL = window.location.search; 

    this.$store.dispatch('auth', {urlCurrent: currentURL, callbackURL: '/', callToAPI: 'callback'}).then(res => {
      this.$store.dispatch('specialTrackData', {urlCurrent: currentURL, callToAPI: 'usertracks'})

      this.$router.push(res.redirect); // Go to homepage
    });
  }
}
</script>

<style lang="scss" scoped>
  @mixin center-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  @mixin hide_sr {
    border: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  #callback_container {
    height: 100vh;
    @include center-content;
  }

  .fa-circle-notch {
    font-size: 3rem;
    animation-name: spin;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .hide_sr {
    @include hide_sr;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
  
</style>