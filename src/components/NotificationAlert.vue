<template>  
  <div id="sr-notify" role="alert" v-if="grabCurrentNotification.length">
      <strong id="sr-notify-topic">{{grabCurrentNotification[0].message}} {{grabCurrentNotificationTime}} {{grabCurrentNotification[0].name}}</strong>
  </div>
</template>

<script>
export default {
  methods: {
    clearNotify() {
      let notifyElem = document.querySelector('#sr-notify-topic');

      if (notifyElem && !notifyElem.textContent.length) {
        notifyElem.textContent =  this.$store.getters.grabNavNotifications[0].message + ' ' +
        this.$store.getters.grabNavNotifications[0].name + ' ' + 
        this.$store.getters.timeAgo[0];
      } 
      
      setTimeout(function() {
        notifyElem = document.querySelector('#sr-notify-topic');
        if (notifyElem) {
          notifyElem.textContent = '';
        }
      }, 5000);
    }
  },
  computed: {
    grabCurrentNotification() {
      const notificationsCurrent = this.$store.getters.grabNavNotifications
      this.clearNotify();
      if (notificationsCurrent.length) {
        return [notificationsCurrent[0]];
      } else {
        return [];
      }
    },
    grabCurrentNotificationTime() {
      const notifyTime = this.$store.getters.timeAgo;

      if (notifyTime.length) {
        return notifyTime[0]
      } else {
        return '';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #sr-notify {
    @include sr_only;
  }
</style>