<template>
    <div class="playlist-track-skeleton">
        <div class="track-title-skeleton">
            <div class="album-image-skeleton"></div>
            <div class="title-skeleton"></div>
        </div>

        <div class="album-type-skeleton"></div>

        <div class="track-duration-skeleton"></div>

        <div class="track-status-skeleton">
        </div>

        <div v-if="currentIndex === 6" class="hidden-track">
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
@mixin skeleton {
    display: block;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(94, 94, 94, 0.2), transparent);
    animation: skeletonDance 0.6s infinite;
}

@mixin skeletonMisc {
    position: relative;
    overflow: hidden;
}

@media (max-width: $breakpoint--03) {
  #room-playlist {
    .title-skeleton {
        width: 80px;
    }

    .album-type-skeleton, .track-duration-skeleton {
        display: none;
    }

    .hidden-track {
        width: 80%;
    }
  }
}

.playlist-track-skeleton {
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
    overflow: hidden;
        .album-image-skeleton {
            width: 50px;
            height: 50px;
            background-color: #1f1f1f;
            background-size: contain;
            @include skeletonMisc;
        }

        .album-image-skeleton::after {
            @include skeleton;
        }

        .track-title-skeleton {
            display: flex;
            align-items: center;
            width: 260px;
            .title-skeleton {
                background-color: #1f1f1f;
                height: 15px;
                width: 100px;
                margin-left: 20px;
                @include skeletonMisc;
            }

            .title-skeleton::after {
                @include skeleton;
            }
        }

        .album-type-skeleton {
            width: 100px;
            background-color: #1f1f1f;
            height: 15px;
            @include skeletonMisc;
        }

        .album-type-skeleton::after {
            @include skeleton;
        }

        .track-status-skeleton {
            height: 30px;
            width: 70px;
            background-color: #1f1f1f;
            padding: 5px;
            @include skeletonMisc;
        }

        .track-status-skeleton::after {
            @include skeleton;
        }

        @keyframes skeletonDance {
            100% {
                transform: translateX(100%);
            }
        }
    }

    .hidden-track {
        position: absolute;
        width: 40%;
        height: 100px;
        background: linear-gradient(0deg, rgba(14,14,14,1) 37%, rgba(255,255,255,0) 100%);
    }
</style>