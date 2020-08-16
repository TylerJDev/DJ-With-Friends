<template>
  <footer>
    <div id="footer_links">
      <a href="/about">About</a>
      <button id="need_help" v-on:click="showModal">Need Help?</button>
    </div>
    <cv-modal
      :close-aria-label="closeAriaLabel"
      :size="size"
      :visible="modalVisible"
      :auto-hide-off="autoHideOff"
      @modal-hidden="closeModal"
      id="help_modal">
      <template v-if="use_label" slot="label">DJ With Friends</template>
      <template v-if="use_title" slot="title">Quick Help</template>
      <template v-if="use_content" slot="content">
        <p id="main_bio_modal">Please refer to the FAQ section below for quick help. If you still need help, <a href="/about#contact">please contact us here.</a></p>
        <cv-accordion>
          <cv-accordion-item>
            <template slot="title">Do I need Spotify Premium?</template>
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
      </template>
    </cv-modal>
  </footer>
</template>

<script>
import { focusEle } from '@/utils/focus.js';

export default {
  name: 'LobbyFooter',
  data() {
    return {
      closeAriaLabel: "Close",
      use_label: true,
      use_title: true,
      use_content: true,
      size: "small",
      visible: false,
      autoHideOff: false,
      modalVisible: false,
    }
  },
  methods: {
    showModal: function() {
      this.modalVisible = this.modalVisible === true ? false : true;
    },
    closeModal: function() {
      this.modalVisible = false;
      focusEle('#need_help');
    }
  }
}
</script>

<style lang="scss">
  #footer_links {
    bottom: 0;
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    margin-bottom: 10px;
    a {
      @include help_link;
    }

    #need_help {
      border: none;
      background-color: transparent;
      color: white;

      @include help_link;
    }
  }

  #help_modal {
    .bx--modal-container {
      height: 500px;
      width: 25% !important;
      background-color: whitesmoke;
      box-shadow: 3px 5px 0px 0px black;
      .bx--modal-header {
        h2, h4 {
          font-family: 'IBM Plex Sans', sans-serif;
        }
      }

      #main_bio_modal {
        margin-bottom: 20px;
      }
      .bx--modal-content, .bx--modal-header, .bx--accordion__content {
        padding-right: 10px !important;
        padding-left: 10px !important;
      }
    }
  }
</style>