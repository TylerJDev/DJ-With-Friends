<template>
  <div id="about">
    <Navbar :hide-bar="false" />
    <h1>About - <span class="name_logo">DJ With Friends</span></h1>

    <div class="about_body">
      <p>DJ With Friends is a website where you can “DJ” by playing your favorite tracks on Spotify. 
        <br/>It works by allowing users to enable their Spotify instance to play the current track that is playing in the room. More than one person can “DJ”, and anyone can add to the queue.

      <br/>
      <br/>
      To DJ you will need Spotify Premium, whereas, anyone can add to the queue. 
      <br/>
      Do you have any questions? Look below for Q&A, or you can contact me by clicking here.
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
        Please be sure to be informative when writing about an issue or bug. You can also place a ticket on Github.</p>
        </div>
        <br/>
        <div class="link_body">
          <a href="https://github.com/TylerJDev/DJ-With-Friends" target="_blank">View on Github</a>
          <br/>
          <a href="https://twitter.com/TylerJ_Dev" target="_blank">View on Twitter</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'about',
  components: {
    Navbar
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
    .link_body {
      font-size: 1.1rem;
      br {
        margin-bottom: 10px;
      }
    }
  }
}
</style>