<template>
  <footer>
    <div id="footer_controls">
      <div class="col">
        <div class="footer_logo">
          <h2>DJ <span class="logo_brand">WITH</span> FRIENDS</h2>
          <h3>Let's DJ!</h3>
        </div>
      </div>
      <div class="col connect">
        <h2>DJWF</h2>
        <router-link to="/about">About</router-link>
        <router-link to="/about#contact">FAQ</router-link>
        <router-link to="/about#contact">Contact</router-link>
        <a href="https://twitter.com/DjwithFriends" target="_blank">
          Twitter
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

  @media (max-width: $breakpoint--09) {
    footer {
      border-top: 1px solid #3c3c3c;
      border-style: dotted;
      height: unset !important;
      padding-left: 0px !important;
      padding-right: 0px !important;
      padding-bottom: 30px !important;
      padding-top: 30px !important;
      #footer_controls {
        justify-content: unset !important;
        flex-direction: column;
        height: unset !important;
        .footer_logo {
          align-items: unset !important;
        }
        .col {
          width: 100%;
        }
        .col:first-of-type {
          margin-top: 10px;
        }
        .col.connect {
          flex-direction: column !important;
          margin-top: 25px;
          a {
            text-align: left;
            font-size: 1.1rem;
            width: 90%;
          }
        }
      }
    }
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
    font-family: 'IBM Plex Sans', sans-serif;
    height: 30%;
    right: 0;
    padding: 20px;
    background-color: #0e0e0e;
    color: white !important;
    display: flex;
    flex-direction: column;
    h2, h3 {
      float: left;
      font-size: 1.5rem;
      font-weight: 600;
      width: 300px;
      text-align: left;
    }

    .logo_brand {
      color: $logo--color;
    }

    #footer_controls {
      display: flex;
      justify-content: space-around;
      height: 150px;
      .col {
        display: flex;
        margin-top: 50px;
        flex-direction: column;
        flex-grow: unset;
        &.connect {
          align-items: end;
          font-weight: 600;
          flex-direction: row;
          h2 {
            color: $logo--color;
            width: 70px;
            border-bottom: 3px solid white;
          }

          a {
            margin-left: 20px;
            font-weight: 500;
            color: #dadada !important;
            &:hover,
            &:focus,
            &:focus-within,
            &:active {
              outline: -webkit-focus-ring-color auto 1px;
            }
          }
        }
        .footer_logo {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #dadada !important;
          }
        }
      }
      a {
        color: black;
        text-decoration: none;
        margin: 10px;
        font-size: 1.2rem;
        border: 2px solid transparent;
      }
    }
  }

  a:focus, a:active, a:hover {
    border: 2px dashed white !important;
    outline: none !important
  }
</style>
