// pages/enterAmount/enterAmount.js
let app = getApp();
let http = require("../../utils/ajax");
let jump = require("../../utils/jump");
let modal = require("../../utils/modal");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    storeCode: null,
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let storeCode = options.storeCode;

    let n = 0;

    wx.showLoading({
      title: "登录中",
      mask: true
    });

    var timer = setInterval(() => {
      if (app.globalData.header) {
        clearInterval(timer);
        timer = null;
        this.setData({
          storeCode: storeCode,
          isLogin: true
        });
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
      } else if (n == 20) {
        clearInterval(timer);
        timer = null;
        this.setData({
          storeCode: storeCode
        });
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
        modal.modal("提示", "登录失败,请重新扫码");
      }
      n++;
      console.log(`第${n}次`);
    }, 500);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

});
