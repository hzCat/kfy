var navbar = require("../../utils/navbar.js");
var util = require("../../utils/util.js");
var turnto = require("../../utils/turnto.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess: 'true',
    isBuy: true,
    orderNo: null,
    money: null,
    gift: null,
    after: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // navbar.title("充值详情")
  },

  jump(e) {
    var jump = e.currentTarget.dataset.jump;
    var pattern = e.currentTarget.dataset.pattern;
    if (pattern == "back") {
      util.jump(pattern);
    } else if (pattern == "redirect") {
      util.jump(pattern, jump)
    }
  }
})