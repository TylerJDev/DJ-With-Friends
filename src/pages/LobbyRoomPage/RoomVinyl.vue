<template>
  <div id="room_vinyl">
    <!-- <h1>DJ WITH FRIENDS</h1> -->
    <transition name="vinyl" v-on:after-enter="afterEnter">
      <div id="vinyl_container" v-if="sleeveIn">
        <div id="vinyl">
          <img v-if="toneArm || toneArmIn" id="tone_arm" :class="[toneArm ? 'tone_arm_in' : toneArmLeave ? 'tone_arm_out' : '']" alt="" src="../../../public/tonearm.svg" />
        </div>
        <div id="sleeve" :class="[sleeveOut ? 'sleeve_out' : sleeveLeave ? 'sleeve_leave' : '']" v-bind:style="{'backgroundImage': 'url(' + this.albumSleeve + ')'}"></div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "RoomVinyl",
  props: {
  },
  data() {
    return {
      sleeveIn: false,
      vinylIn: false,
      sleeveOut: false,
      sleeveLeave: false,
      toneArm: false,
      toneArmLeave: false,
      toneArmIn: false,
      albumSleeve: '',
    };
  },
  methods: {
    afterEnter: function () {
      this.vinylIn = true;
      setTimeout(runAnimation.bind(this), 5000);

      function runAnimation() {
        this.sleeveOut = true;
        this.toneArm = true;
      }
      setTimeout(runTone.bind(this), 10000);
      function runTone() {
        this.toneArm = false;
        this.toneArmIn = true;  

        // null timeout to pause
        setTimeout(hideTone.bind(this), 2500);
        function hideTone() {
          this.toneArmLeave = true;
        }

        // null timeout to pause
        setTimeout(change.bind(this), 5000);
        function change() {
          this.changeVinyl();
        }
      }
    },
    changeVinyl: function() {
      setTimeout(runAnimation.bind(this), 2000);

      function runAnimation() {
        this.sleeveIn = false;
        this.sleeveLeave = true;
      }

      setTimeout(reRunAnimation.bind(this), 10000);
      function reRunAnimation() {
        this.sleeveOut = false;
        this.vinylIn = false;
        this.sleeveIn = false;
        this.sleeveLeave = false;
        this.toneArm = false;
        this.toneArmLeave = false;
        this.toneArmIn = false;

        this.changeAlbumArt();
        setTimeout(runNewAnimation.bind(this), 2500);

        function runNewAnimation() {
          this.sleeveIn = true;
        }
      }
    },
    changeAlbumArt() {
      if (this.$store.state.spotifyAPIData.topTrackData !== null) {
        const albumTop = JSON.parse(this.$store.state.spotifyAPIData.topTrackData);
        let trackGrab = Math.floor(Math.random() * albumTop.items.length);
        let trackAlbumArt = albumTop.items[trackGrab].album;

        trackAlbumArt = (trackAlbumArt.images.length || trackAlbumArt.images !== undefined) ? trackAlbumArt.images[0].url : '';
        this.albumSleeve = trackAlbumArt;
      }
    }
  },
  mounted() {
    setTimeout(runAnimation.bind(this), 2500);

    function runAnimation() {
       this.sleeveIn = true;
    }

    this.changeAlbumArt();
  }
};
</script>

<style lang="scss">
  @media (max-width: 66rem) {
    #room_vinyl {
      display: none !important;
    }
  }

  .vinyl-enter-active {
    animation: vinyl-in 5s;
  }

  .vinyl-leave-active {
    animation: vinyl-in 5s reverse; 
  }

  .sleeve_out {
    animation: vinyl-out 5s;
    transform: translate(-50%, -10%);
    opacity: 0;
  }

  .sleeve_leave {
    animation: vinyl-out 5s reverse;
  }

  .tone_arm_in {
    animation: tonearm-in 3s;
    transform: rotate(340deg);
    opacity: 1;
  }

  .tone_arm_out {
    animation: tonearm-in 5s reverse;
    transform: rotate(340deg);
    opacity: 0;
  }

  @keyframes vinyl-in {
    0% {
      transform: translate(0%, 1000%);
    }
    100% {
      transform: translate(0%, 0%);
    }
  }

  @keyframes vinyl-out {
    0% {
      opacity: 1;
      transform: translate(-50%, -10%);
    }
    100% {
      transform: translate(-50%, 200%);
      opacity: 0;
    }
  }

  #vinyl {
    transform: translate(0% , 0%);
    animation: vinyl-up 8s;
  }

  @keyframes vinyl-up {
    0% {
      opacity: 0;
      transform: translate(0% , 245%);
    }
    100% {
      opacity: 1;
      transform: translate(0% , 0%);
    }
  }

  @keyframes tonearm-in {
    0% {
      opacity: 0;
      transform: rotate(310deg);
    }
    100% {
      opacity: 1;
      transform: rotate(340deg);
    }
  }

   @keyframes tonearm-out {
    0% {
      opacity: 1;
      transform: rotate(340deg);
    }
    100% {
      opacity: 0;
      transform: rotate(310deg);
    }
  }

  #vinyl {
    width: 100px;
    height: 100px;
    // width: 50px;
    // height: 50px;
    border: 1px solid #707070;
    border-radius: 50%;
    background-color: rosybrown;
    border: 1px solid black;
    margin: 0 auto;
    box-shadow: 0px 0px 0px 170px #2c2c2a, 0px 0px 0px 171px black, 8px 8px 0px 172px grey;
    position: relative;
    z-index: 1;
  }

  #sleeve {
    width: 450px;
    height: 440px;
    border: 1px solid black;
    margin: 0 auto;
    background-color: white;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -10%);
    box-shadow: 3px 5px 0px 3px grey;
    background-size: cover;
    z-index: 100;
    background-color: burlywood;
  }  

  #tone_arm {
    position: absolute;
    z-index: 100;
    width: 360px;
    bottom: -130%;
    left: 110%;
    width: 360px;
    transform: rotate(340deg);
  }
</style>