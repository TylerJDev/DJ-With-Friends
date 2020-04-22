<template>
  <footer>
    <div id="footer_controls">
      <router-link to="/about">About</router-link>
      <router-link to="/about#contact">Need Help?</router-link>
    </div>
  </footer>
</template>

<style scoped lang="scss">
  @mixin help_link {
    text-decoration: underline;
    color: black;
    font-size: 0.8rem;
  }

  #leave_room {
    margin-top: 10px;
    display: block;
    text-decoration: none;
    color: black;
    font-size: 1.5rem;
  }

  #nav_controls, #nav_controls button {
    width: initial;
    padding: 0px 30px 0px 30px;
  }

  footer {
    font-family: 'Roboto Condensed', sans-serif;
    height: 10%;
    right: 0;
    padding: 20px;
    #footer_controls {
      display: flex;
      justify-content: space-around;
      a {
        color: black;
        text-decoration: none;
        @include help_link;
      }
    }
  }
</style>
