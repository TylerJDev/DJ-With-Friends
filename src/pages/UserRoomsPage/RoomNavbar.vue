<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div id="leave_room_container">
      <a href="/" id="leave_room" title="Leave Room"><i class="fas fa-times"></i></a>
    </div>

    <div id="nav_controls" class="ml-auto">
      <button>Users</button>
      <button>History</button>
      <button type="button" class="btn" data-toggle="modal" data-target=".bd-example-modal-lg">Add to Queue</button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
  #leave_room_container{
    height: 100%;
    width: 65px;
    border: none;
    font-size: 1.3rem;
  }

  #leave_room {
    @extend #leave_room_container;
    margin-top: 10px;
    display: block;
    text-decoration: none;
    color: black;
    font-size: 1.5rem;
  }

  #nav_controls, #nav_controls button {
    @extend #leave_room_container;
    width: initial;
    padding: 0px 30px 0px 30px;
  }

  .navbar {
    height: 60px; 
    padding: 0px;
  }
</style>
