<template>
  <footer>
    <div id="footer_controls">
      <div class="col">
        <h2>DJ WITH FRIENDS</h2>
      </div>
      <div class="col">
        <router-link to="/about">About</router-link>
        <router-link to="/about#contact">FAQs</router-link>
        <router-link to="/about#contact">Support</router-link>
      </div>
      <div class="col connect">
        <h2>Connect:</h2>
        <a href="https://twitter.com/DjwithFriends" aria-label="Twitter" target="_blank">
          <i class="fab fa-twitter-square"></i>
        </a>
        <a href="https://github.com/TylerJDev/DJ-With-Friends" aria-label="Github" target="_blank">
          <i class="fab fa-github-square"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
  @mixin help_link {
    text-decoration: underline;
    color: white;
    font-size: 1.1rem;
  }

  #leave_room {
    margin-top: 10px;
    display: block;
    text-decoration: none;
    color: white;
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
    background-color: black;
    color: white !important;
    display: flex;
    flex-direction: column;
    h2 {
      float: left;
      font-size: 1.5rem;
    }
    #footer_controls {
      display: flex;
      justify-content: space-around;
      .col {
        display: flex;
        align-items: center;
        justify-content: center;
        &.connect a {
          font-size: 1.5rem;
        }
      }
      a {
        color: black;
        text-decoration: none;
        @include help_link;
        margin: 10px;
      }
    }
  }
</style>
