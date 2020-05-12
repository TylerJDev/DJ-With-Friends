<template>  
  <div id="fourohfour">
    <Navbar :hide-bar="false" />
    <h1 id="main_heading">404 NOT FOUND</h1>
    <div id="main_container" class="container-fluid">
      <div id="vinyl_404">
        <div id="sleeve_404">
          <h2>UH OH!</h2>
          <div id="vinyl_window"><div id="inner"></div></div>
          <h2>PAGE NOT FOUND!</h2>
        </div>
        <div id="vinyl_">
        </div>
      </div>
      <router-link to="/" id="back_to_home">Back to Homepage</router-link>
    </div>
    <LobbyFooter />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import LobbyFooter from '@/pages/LobbyRoomPage/LobbyFooter.vue';

export default {
  mounted() {
    this.$store.state.loading = false;
  },
  components: {
    Navbar,
    LobbyFooter
  }
}
</script>

<style lang="scss" scoped>
  #fourohfour {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-top: 3rem;
    padding: 0;
    height: 100%;
    overflow: hidden;
    h1 {
      text-align: center;
      font-style: "IBM Plex Sans";
      position: relative;
      top: 26px;
      background-color: #e2d7ca;
      width: 25%;
      left: 6%;
      font-weight: 500;
    }
    #main_container {
      display: flex;
      padding: 0px !important;
      height: 80%;
      border: 1px dashed grey;
      width: 95%;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      #back_to_home {
        margin-top: 40px;
        font-size: 1.5rem;
        text-decoration: underline;
        color: black;
        font-family: 'IBM Plex Sans', sans-serif;
        font-weight: lighter;
      }
    }
    #vinyl_404 {
      display: flex;
      align-items: center;
      #sleeve_404 {
        width: 450px;
        height: 400px;
        border: 1px solid black;
        background-color: white;
        border: 1px solid black;
        background-size: cover;
        z-index: 100;
        background-color: white;

        h2 {
          font-size: 2.5rem;
          font-family: 'Times New Roman', sans-serif;
          color: black !important;
          &:first-of-type {
            margin-top: 20px;
          }
        }
        #vinyl_window {
          display: flex;
          align-items: center;
          justify-content: center;
          #inner {
            background-color: burlywood;
            height: 250px;
            width: 150px;
          }
          height: 280px;
          width: 180px;
          margin: 0 auto;
          border: 1px solid black;
        }
      } 

      #vinyl_ {
        width: 100px;
        height: 100px;
        border: 1px solid #707070;
        border-radius: 50%;
        background-color: rosybrown;
        border: 1px solid black;
        box-shadow: 0px 0px 0px 140px #2c2c2a, 0px 0px 0px 141px whitesmoke, 8px 8px 0px 142px grey;
        z-index: 1;
        position: relative;
        right: 75px;
      }
    }
  }
</style>