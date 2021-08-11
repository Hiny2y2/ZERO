import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron'
import store from '../renderer/store'

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
const dgram = require('dgram')

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    minHeight: 450,
    maxHeight: 700,
    useContentSize: true,
    width: 1000,
    minWidth: 750,
    maxWidth: 1100,
    frame: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
// 限制只可以打开一个应用, 4.x的文档
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      mainWindow.show()
    }
  })
  // 创建 myWindow, 加载应用的其余部分, etc...
  // app.on('ready', () => {
  // })
  app.on('ready', createWindow)
}
//--------------------

// app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
ipcMain.on('min', e=> mainWindow.minimize());
ipcMain.on('max', e=> {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
    } else {
        mainWindow.maximize()
    }
});
ipcMain.on('close', e=> {
  mainWindow.close()

});
const socket = dgram.createSocket('udp4');

try{
  socket.bind(61111)
}catch(e){
  console.log(e)
}
socket.on('message', function (remsg) {
  //如果接受到游戏传来的startgame
  let msg= remsg.toString()
  console.log(msg)
  // ipcRenderer.send('action-game', msg)
})

var exec = require('child_process').execFile;
var openGame= function(src){ //启动exe文件
  exec(src, function(err, data) {  
       console.log(err)
  });  
}

ipcMain.on('start-success', (event, arg) => {
  //成功启动游戏后
  // let sendJson= JSON.parse(arg)
  // socket.send(arg, 62222, '127.0.0.1')
})
//-----------
ipcMain.on('asynchronous-message', (event, arg) => {
  //打开游戏exe
  // socket.send('startGame', 0, 10, 62222, '127.0.0.1')
  console.log('启动dddddd',event, arg)
  let url= __dirname.replace('\\resources\\app.asar\\dist\\electron', `\\game\\zero.exe ${arg}`) 
  // openGame(__dirname + "\\game\\zero.exe")
  openGame(url)
  let re=url
  event.sender.send('asynchronous-reply', re)
})
//-----------

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
