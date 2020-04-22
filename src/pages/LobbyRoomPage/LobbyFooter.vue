<template>
  <footer>
    <div id="footer_links">
      <a href="/about">About</a>
      <a href="/">Need Help?</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'LobbyFooter',
}
</script>

<style lang="scss" scoped>
  #footer_links {
    bottom: 0;
    display: flex;
    justify-content: space-around;
    a {
      margin: 10px;
      @include help_link;
    }
  }
</style>