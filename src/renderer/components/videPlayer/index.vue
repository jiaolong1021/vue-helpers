<template>
  <div class="m-player">
    <video ref="video" autoplay width="400"></video>
  </div>
</template>
<script type="text/javascript">
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import 'videojs-contrib-hls'

export default {
  name: 'ZlPlayer',
  data () {
    return {
      player: null
    }
  },
  mounted () {
    this.initPlayer()
  },
  methods: {
    initPlayer () {
      this.player = videojs(this.$refs.video, {
        currentWidth: 400,
        height: 200
      })
      this.player.src({
        src: 'http://localhost:8000/live/stream/index.m3u8',
        type: 'application/x-mpegURL'
      })
      this.player.play()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.m-player video {
  width: 400px;
}
</style>
