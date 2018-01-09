let app = getApp();
let http = require("../../utils/ajax.js");
let navbar = require("../../utils/navbar.js");
let storage = require("../../utils/storage.js");
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
    userscreenLight: null
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
    this.setData({
      QRModal: true,
      QRsrc: "../../img/default_QR.png"
    });
  },
  // 关闭页面时,恢复亮度
  onUnload: function() {
    let that = this;
    wx.setScreenBrightness({
      value: that.data.userscreenLight
    });
  },
  // 获取所有信息
  getAllInfo() {
    storage.gets("allInfo").then(res => {
      this.setData({
        allInfo: res.data
      });
      this.isVip(res.data);
      console.log("进入获取到的allInfo,已经赋值data", this.data.allInfo);
    });
  },
  // 查找是否vip或者tvip
  isVip(allInfo) {
    let all = allInfo;
    let cardList = all.vipCardList;
    let length = cardList.length;
    let arr = [];
    let isVip = false;
    let isTvip = false;
    for (let i = 0; i < length; i++) {
      let obj = cardList[i];
      if (obj.vipScope == "VIP") {
        arr[0] = obj;
        isVip = true;
      }
      if (obj.vipScope == "TVIP") {
        arr[1] = obj;
        isTvip = true;
      }
    }
    console.log("修改后的cardlist", arr);
    this.setData({
      cardList: arr,
      isVip: isVip,
      isTvip: isTvip
    });
  },
  // 获取二维码
  getQR() {
    let that = this;
    // 获取屏幕亮度
    wx.getScreenBrightness({
      success(res) {
        console.log("亮度", res.value);
        that.setData({
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
        QRsrc: "data:image/png;base64," + res.data.data
      });
      // 最高亮度
      wx.setScreenBrightness({
        value: 1
      });
    });
  }
});
