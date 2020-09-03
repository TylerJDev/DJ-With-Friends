<template>
  <div id="about">
    <Navbar @logout="userLogout" :hide-bar="false" :user="user" />
    <h1>About - <span class="name_logo">DJ With Friends</span></h1>
    {{user}}
    <div class="about_body">
      <p>DJ With Friends is a website where you can “DJ” by playing your favorite tracks on Spotify. 
        <br/>More than one person can “DJ”, and anyone can add to the queue.

      <br/>
      </p>
    </div>

    <div id="q_and_a">  
      <h2>Q&A</h2>
      <cv-accordion>
        <cv-accordion-item>
          <template slot="title">Do I need Spotify Premium to use DJ With Friends?</template>
            <template slot="content"> 
              <p><strong>No</strong>, you do not need Spotify Premium to use DJ With Friends. Premium is only needed to “DJ/Host”.</p>
            </template>
        </cv-accordion-item>
        <cv-accordion-item>
          <template slot="title">Can I host a private room?</template>
          <template slot="content">
            <p><strong>Yes</strong>, you can make a private room by enabling the "Private Room" checkbox when creating a new room.</p>
          </template>
        </cv-accordion-item>
        <cv-accordion-item id="hosting_tab">
          <template slot="title">Can I create more than one room?</template>
          <template slot="content">
            <p><strong>No</strong>, currently you may only create one room. This may change in the future.</p>
          </template>
        </cv-accordion-item>
      </cv-accordion>
    </div>

    <div id="contact">
      <h2>Contact</h2>
      <div class="contact_body">
        <div class="message_body">
        <p>You can get in contact via the following links. 
          <br/>
        Please be sure to be informative when writing about an issue or bug. You can also place a ticket on GitHub.</p>
        </div>
        <br/>
        <div class="link_body">
          <div class="link_container">
          <a href="https://github.com/TylerJDev/DJ-With-Friends" target="_blank" class="social_link"><i class="fab fa-github"></i> View on Github</a>
          </div>
          <div class="link_container">
          <a href="https://twitter.com/DjwithFriends" target="_blank" class="social_link twitter_link"><i class="fab fa-twitter"></i> View on Twitter</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'about',
  props: ['user'],
  components: {
    Navbar
  },
  mounted() {
    this.$store.state.loading = false;

    if (this.$store.state.darkMode == true) {
      /* This was added as it seems that without, the style will not apply based on class > style declaration */
      document.body.setAttribute('style', 'background-color: #2b2b2b !important');
    }
  },
  methods: {
    userLogout: function() {
      this.$emit('logout');
    }
  }
}
</script>

<style lang="scss">

@media (max-width: 66rem) {
  #about {
    width: auto !important;
  }
}

h1, h2, h3, h4, h5, h6 {
   font-family: 'IBM Plex Sans', sans-serif;
}

#about {
  h1, h2 {
    font-weight: 400;
  }
  .name_logo {
    font-size: 1.5rem;
    vertical-align: middle
  }
  padding: 20px;
  width: 50%;
  margin: 0 auto;
  text-align: left;
  .about_body {
    margin-top: 20px;
    p {
      font-size: 1.1rem;
    }
  }
  #q_and_a {
    @extend .about_body;
    margin-top: 30px;
    h2 {
      margin-bottom: 20px;
    }
    .bx--accordion__item {
      border-top: 1px solid gray;
      &:last-child {
        border-bottom: 1px solid gray;
      }
    }
    
    p {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  #contact {
    @extend .about_body;
    margin-bottom: 30px;
    .message_body {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .link_body {
      font-size: 1.1rem;
      display: flex;
      justify-content: space-evenly;
      br {
        margin-bottom: 10px;
      }
      .link_container {
        border: 1px solid black;
        min-height: 40px;
        background-color: #eee;
        border: 1px solid black;
        box-shadow: 3px 3px 1px black;
        display: flex;
        justify-content: center;
        a {
          color: black;
          padding: 10px;
          i {
            color: grey;
          }
          &.twitter_link > i {
            color: #00acee !important;
          }
        }
      }
    }
  }
}
</style>