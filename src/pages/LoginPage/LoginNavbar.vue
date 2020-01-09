<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div id="nav_controls">
      <a href="/about">About</a>
    </div>
  </nav>
</template>

<style scoped lang="scss">
  @mixin center-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .navbar {
    height: 60px; 
    padding: 0px;
    position: absolute;
    right: 0;
    width: 200px;
    @include center-content;

    #nav_controls {
      font-family: 'Roboto Condensed', sans-serif;
      a {
        font-size: 1.3rem;
        color: black;
        text-decoration: none;
      }
    }
  }
</style>
