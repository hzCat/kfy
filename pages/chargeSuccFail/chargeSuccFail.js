var navbar = require("../../utils/navbar.js");
var jump = require("../../utils/jump.js");
var turnto = require("../../utils/turnto.js");
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSuccess: "true",
    isBuy: true,
    orderNo: null,
    money: null,
    gift: null,
    after: null,
    serviceNumber: "请咨询店小二",
    modalOn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    var mon = turnto.tostr(Number(options.money));
    var gif = turnto.tostr(Number(options.gift));
    var aft = turnto.tostr(Number(options.after));
    this.setData({
      isSuccess: options.isSucc,
      isBuy: options.isBuy,
      orderNo: options.orderNo,
      money: mon,
      gift: gif,
      after: aft,
      serviceNumber: app.globalData.serviceNumber
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // navbar.title("充值详情")
  },

  jump(e) {
    this.setData({
      modalOn: true
    });
    var jump = e.currentTarget.dataset.jump;
    var pattern = e.currentTarget.dataset.pattern;
    if (pattern == "back") {
      jump.jump(pattern);
    } else if (pattern == "switch") {
      jump.jump(pattern, jump);
    }
  },
  call() {
    let that = this;
    if (this.data.serviceNumber) {
      wx.makePhoneCall({
        phoneNumber: that.data.serviceNumber
      });
    }
  }
});
