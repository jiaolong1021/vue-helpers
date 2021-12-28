'use strict'
import { app, BrowserWindow } from 'electron'
const path = require('path')
const NodeMediaServer = require('node-media-server')

const config = {
  rtmp: {
    port: 8899,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    mediaroot: './media',
    allow_origin: '*'
  },
  trans: {
    ffmpeg: path.join(__dirname, '../../static/ffmpeg/ffmpeg'),
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
}

var nms = new NodeMediaServer(config)
nms.run()

const ffmpeg = require('fluent-ffmpeg')
/**
 * [ '-fflags', 'nobuffer', '-vcodec', 'libx264', '-preset', 'superfast', '-rtsp_transport', 'tcp', '-threads', '2', '-r', '25', '-an' ]
 * ffmpeg -r 25 -i rtsp://admin:a1111111@192.168.15.223:554/h264/ch1/main/av_stream -an -filter:v scale=w=640:h=480 -fflags nobuffer
 * ffmpeg -i rtsp://admin:12345@10.0.10.19:554/Streaming/Channels/101 -fflags flush_packets -max_delay 1 -an -flags -global_header
 * -hls_time 1 -hls_list_size 3 -hls_wrap 3 -vcodec copy -y /var/www/video/channel101.m3u8
 * ffmpeg -re -i INPUT_FILE_NAME -c copy -f flv rtmp://localhost/live/STREAM_NAME
 * ffmpeg -r 25 -i INPUT_FILE_NAME -an -filter:v scale=w=640:h=480 -re -i -c copy -f flv rtmp://localhost/live/stream
 */
ffmpeg('rtsp://admin:a1111111@192.168.15.223:554/h264/ch1/main/av_stream')
  .setFfmpegPath(path.join(__dirname, '../../static/ffmpeg/ffmpeg'))
  // .inputOptions(['-re'])
  // .outputOptions(['-c', 'copy', '-f', 'flv'])
  .outputOptions([ '-fflags', 'nobuffer', '-vcodec', 'libx264', '-preset', 'superfast', '-rtsp_transport', 'tcp', '-threads', '2', '-r', '25', '-an' ])
  .inputFPS(24)
  .noAudio()
  .size('480x?')
  .aspect('4:3')
  .format('flv')
  .save('rtmp://localhost:8899/live/stream')
  .on('start', function (e) {
    console.log('ffmpeg stream: ' + e)
  })
  .on('end', function () {
    console.log('ffmpeg is end')
  })
  .on('error', function (err) {
    console.log('ffmpeg is error! ' + err)
  })

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: 1600,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
