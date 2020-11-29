<template>
    <div class="playlist-track" v-if="currentIndex < 6">
        <div class="track-title">
            <div class="album-image" :style="{backgroundImage: `url('${trackType.track.album.images[0].url}')`}"></div>
            <p>{{trackType.track.name}}</p>
        </div>

        <div class="album-type">
            <p>{{trackType.track.album.name}}</p>
        </div>

        <div class="track-duration">
            <p>{{trackType.track.duration}}</p>
        </div>

        <div :class="[currentIndex === 0 ? 'track-status' : 'track-status queue']">
            <p>
                <span v-if="currentIndex === 0">Playing</span>
                <span v-if="currentIndex > 0">In Queue</span>
            </p>  
        </div>

        <div v-if="currentIndex === 5" class="hidden-track">
        </div>
    </div>
</template>

<script>
export default {
  name: 'featuredTrack',
  props: {
      trackType: Object,
      currentIndex: Number,
  },
  methods: {},
  computed: {},
  mounted() {
      
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: $breakpoint--03) {
  #room-playlist {
      .playlist-track {
          overflow: hidden;
          .track-title p {
              font-size: 0.9rem !important;
              width: 100px;
          }
          .album-type, .track-duration {
              display: none;
          }
          .track-status {
              width: 80px;
              p {
                font-size: 0.8rem;
              }
          }
          .hidden-track {
              width: 80%;
          }
      }
  }
}

#room-playlist {
    .playlist-track {
        display: flex;
        flex-direction: row;
        width: 40%;
        height: 50px;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #3c3c3c;
        border-style: dotted;
        padding-top: 50px;
        padding-bottom: 50px;

        // &:last-of-type {
        //     border-bottom: 1px solid #3c3c3c;
        // }

        .album-image {
            width: 50px;
            height: 50px;
            border: 1px solid white;
            background-size: contain;
        }

        p {
            color: #dadada !important;
        }

        .track-title {
            display: flex;
            align-items: center;
            width: 250px;
            p {
                font-family: 'IBM Plex Sans', sans-serif;
                font-weight: 600;
                font-size: 1rem;
                margin-left: 20px;
                color: white !important;
            }
        }

        .album-type {
            width: 160px;
        }

        .track-status {
            box-shadow: -3px 3px 0px #4e4e4e;
            max-width: 100px;
            min-width: 40px;
            color: white;
            background-color: blue;
            padding: 5px;
            border: 1px solid black;

            &.queue {
            background-color: #262688;
            }

            p {
            font-weight: 600;
            font-family: 'IBM Plex Sans', sans-serif;
            }
        }
    }

    .hidden-track {
        position: absolute;
        width: 40%;
        height: 100px;
        background: linear-gradient(0deg, rgba(14,14,14,1) 37%, rgba(255,255,255,0) 100%);
    }
}
</style>