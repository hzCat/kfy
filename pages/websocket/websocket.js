let storage = require("../../utils/storage.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    header: {}
  },
  onShow() {
    let that = this
    storage.gets("3rd_session")
      .then(function (res) {
        console.log("3rd为", res.data)
        that.setData({
          header: {
            '_yzsaas_token': res.data,
            "content-type": "application/x-www-form-urlencoded"
          }
        })
      })
  },
  sendMessage(e) {
    let msg = e.detail.value
    wx.sendSocketMessage({
      data: msg,
    })
    // SocketTask.send({
    //   data:msg
    // })
  },
  connectWebsocket: function () {
    let that = this
    wx.connectSocket({
      url: 'ws://192.168.1.92:8082/tradePushServer',
      data: {},
      header: that.data.header,
      method: "GET"
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    // // send
    // wx.sendSocketMessage(function(){

    // })
    // get
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
    })
  }
})