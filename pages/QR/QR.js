let app = getApp();
let http = require("../../utils/ajax.js");
let navbar = require("../../utils/navbar.js");
let storage = require("../../utils/storage.js");
let jump = require("../../utils/jump.js");
let card = require("../../utils/cardTurn.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    QRsrc: "../../img/default_QR.png",
    vipScope: "VIP",
    isVip: false,
    isTvip: false,
    allInfo: {},
    cardList: [],
    QRModal: true,
    userscreenLight: null,
    paySucc: false,
    openModal: false,
    showMoney: false,
    modalOn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      vipScope: options.vipScope
    });
    // 获取所有信息
    this.getAllInfo();
    if (options.vipScope == "VIP") {
      navbar.color("#ffffff", "#efac40");
    } else if (options.vipScope == "TVIP") {
      navbar.color("#ffffff", "#d6524a");
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    // 获取屏幕亮度
    wx.getScreenBrightness({
      success(res) {
        console.log("onshow获取亮度", res.value);
        that.setData({
          userscreenLight: res.value,
          QRModal: true,
          QRsrc: "../../img/default_QR.png",
          showMoney: false
        });
      },
      fail: function() {
        that.setData({
          QRModal: true,
          QRsrc: "../../img/default_QR.png"
        });
      }
    });
  },
  // 关闭页面时,恢复亮度
  onUnload: function() {
    let that = this;
    wx.setScreenBrightness({
      value: that.data.userscreenLight
    });
    wx.closeSocket();
  },
  // 获取所有信息
  getAllInfo() {
    storage.gets("allInfo").then(res => {
      let list = res.data.vipCardList;
      let arr = card.turn(list);
      console.log("新卡片列表",arr)
      this.setData({
        allInfo: res.data,
        cardList: arr
      });
      // this.isVip(res.data);
      console.log("进入获取到的allInfo,已经赋值data", this.data.allInfo);
    });
  },
  // 查找是否vip或者tvip
  // isVip(allInfo) {
  //   let all = allInfo;
  //   let cardList = all.vipCardList;
  //   let length = cardList.length;
  //   let arr = [];
  //   let isVip = false;
  //   let isTvip = false;
  //   for (let i = 0; i < length; i++) {
  //     let obj = cardList[i];
  //     if (obj.vipScope == "VIP") {
  //       arr[0] = obj;
  //       isVip = true;
  //     }
  //     if (obj.vipScope == "TVIP") {
  //       arr[1] = obj;
  //       isTvip = true;
  //     }
  //   }
  //   console.log("修改后的cardlist", arr);
  //   this.setData({
  //     cardList: arr,
  //     isVip: isVip,
  //     isTvip: isTvip
  //   });
  // },
  // 获取二维码
  getQR() {
    let that = this;
    wx.connectSocket({
      url: "ws://192.168.1.146/websocket/tradePushServer",
      data: {},
      header: app.globalData.header,
      method: "GET"
    });
    // 获取屏幕亮度
    wx.getScreenBrightness({
      success(res) {
        console.log("亮度", res.value);
        that.setData({
          modalOn: true,
          userscreenLight: res.value
        });
      }
    });
    // 生成随机数
    var random = function() {
      return Math.random()
        .toString(10)
        .substr(7, 7);
    };
    var num = random();
    let url = "/vipPayment/getVipCardQrcode";
    let data = {
      vipScope: this.data.vipScope,
      random: num
    };
    http.ajax(url, "GET", data, app.globalData.header).then(res => {
      this.setData({
        QRModal: false,
        QRsrc: "data:image/png;base64," + res.data.data,
        showMoney: true
      });
      // 最高亮度
      wx.setScreenBrightness({
        value: 1
      });
      that.openQRmodal();
      // 连接成功
      wx.onSocketOpen(function(res) {
        console.log("WebSocket连接已打开！", res);
      });
      wx.onSocketError(function(err) {
        console.log("WebSocket连接打开失败，请检查！", err);
      });
      wx.onSocketClose(function(res) {
        console.log("WebSocket 已关闭！", res);
      });
      wx.onSocketMessage(function(res) {
        let json = JSON.parse(res.data);
        console.log("扫码支付", json);
        let status = json.tradeResult.tradeStatus;
        let id = json.arg1;
        that.getPayBack(status, id);
      });
    });
  },
  openQRmodal() {
    let that = this;
    setTimeout(() => {
      this.setData({
        QRModal: true,
        QRsrc: "../../img/default_QR.png"
      });
      wx.setScreenBrightness({
        value: that.data.userscreenLight
      });
    }, 50000);
  },
  // websocket 长连接获取支付信息
  getPayBack(status, id) {
    let that = this;
    if (this.data.vipScope == "VIP") {
      if (status == "SUCCESS") {
        this.setData({
          paySucc: true,
          openModal: true
        });
        setTimeout(() => {
          this.setData({
            paySucc: false,
            openModal: false
          });
          wx.setScreenBrightness({
            value: that.data.userscreenLight
          });
          jump.jump("nav", `/pages/afterScanPay/afterScanPay?id=${id}`);
        }, 1500);
      } else {
        this.setData({
          paySucc: false,
          openModal: true
        });
        setTimeout(() => {
          this.setData({
            paySucc: false,
            openModal: false,
            QRModal: true
          });
          wx.setScreenBrightness({
            value: that.data.userscreenLight
          });
        }, 2000);
      }
    } else if (this.data.vipScope == "TVIP") {
      if (status == "SUCCESS") {
        this.setData({
          paySucc: true,
          openModal: true
        });
        setTimeout(() => {
          this.setData({
            paySucc: false,
            openModal: false
          });
          wx.setScreenBrightness({
            value: that.data.userscreenLight
          });
          jump.jump("nav", `/pages/groupAfterPay/groupAfterPay?id=${id}`);
        }, 1500);
      } else {
        this.setData({
          paySucc: false,
          openModal: true
        });
        setTimeout(() => {
          this.setData({
            paySucc: false,
            openModal: false,
            QRModal: true
          });
          wx.setScreenBrightness({
            value: that.data.userscreenLight
          });
        }, 2000);
      }
    }
  },
  jump(e) {
    let type = e.currentTarget.dataset.type;

    this.setData(
      {
        modalOn: true
      },
      () => {
        if (type == "personal") {
          jump.jump(
            "nav",
            "/pages/chargeMoney/chargeMoney?by=VIP&isVip=true&money=50"
          );
        } else if (type == "group") {
          jump.jump("nav", "/pages/groupCharge/groupCharge");
        }
      }
    );
  }
});
