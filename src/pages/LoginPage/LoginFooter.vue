<template>
  <footer>
    <div id="footer_controls">
      <a href="https://github.com/TylerJDev/Spotify-With-Friends" target="_blank">View On GitHub</a>
      <a href="/about#contact">Need Help?</a>
      <span>Version 0.0.1</span>
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
      justify-content: space-between;
      a {
        color: black;
        text-decoration: none;
        @include help_link;
      }
    }
  }
</style>
