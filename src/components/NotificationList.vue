<template>  
  <ul class="panel_list" aria-live="polite">
    <li v-for="(item, index) in users" :key="'notification' + '_' +index">
      <InformationFilled16 v-if="item.type === 'info'" class="info_notify"/><CheckedFilled16 v-if="item.type === 'success'" class="success_notify"/> <strong> {{item.message}}:</strong> {{item.name}}<br>
      <span class="time_added">{{timeAgo[index]}}</span>
    </li>

    <div id="view_all" v-if="limit && this.$store.state.notificationList.length > 10">
      <button @click="viewAllNotifications">View All ({{this.$store.state.notificationList.length - 10}})</button>
    </div>

    <div class="notification_none" v-if="!users.length">
      <div><InformationFilled16 /></div>
      <h3>No Notifications!</h3>
    </div>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      notifications: this.$store.state.notificationList,
      limit: true
    }
  },
  methods: {
    viewAllNotifications: function() {
      this.limit = false;
    }
  },
  computed: {
    timeAgo: function() {
      return this.$store.getters.timeAgo;
    },
    users: function() {
      let notificationItems = this.limit ? this.$store.state.notificationList.filter((current, index) => index < 10) : this.$store.state.notificationList;
      return notificationItems;
    }
  }
}
</script>

<style lang="scss" scoped>
  $notification--light: #595959;

  .time_added {
    @include extra_text;
    margin-left: 15px;
  }

  .notification_none {
    position: relative;
    top: 25%;
    color: $notification--light;
    div {
      display: flex;
      justify-content: center;
      svg {
        width: 30px;
        height: 30px;
        fill: $notification--light;
      }   
    }
  }

  #view_all {
      display: flex;
      justify-content: center;
      height: 40px;
      border-top: 1px solid black;
    > button {
      border: none; 
      background-color: transparent;
      text-decoration: underline;
    }
  }

  .info_notify {
    fill: darkcyan;
  }

  .success_notify {
    fill: green
  }
</style>