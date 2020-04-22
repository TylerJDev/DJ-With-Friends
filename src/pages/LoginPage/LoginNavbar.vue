<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div id="nav_controls">
      <a href="/about">About</a>
    </div>
  </nav>
</template>

<style scoped lang="scss">

  .navbar {
    display: flex;
    width: 100%;
    position: absolute;
    justify-content: flex-end;
    padding: 25px;
    
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
