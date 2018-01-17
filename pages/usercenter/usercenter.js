// pages/userCenter/userCenter.js
let app = getApp();
let jump = require("../../utils/jump.js");
let http = require("../../utils/ajax.js");
let storage = require("../../utils/storage.js");
let update = require("../../utils/update.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allInfo: {},
    userInfo: {},
    headDefault: "../../icon/default_head.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    storage.gets("allInfo").then(res => {
      this.setData({
        allInfo: res.data
      });
    });
    storage.gets("userInfo").then(res => {
      console.log("userInfo", res.data);
      this.setData({
        userInfo: res.data
      });
    });
  },
  // 下拉刷新用户信息
  onPullDownRefresh() {
    this.refreshUserInfo();
  },

  // 刷新
  refreshUserInfo() {
    let that = this;
    wx.showNavigationBarLoading();
    update.updateuser(app.globalData.header);
    // that.getUserInfo();
    setTimeout(function() {
      storage.gets("allInfo").then(res => {
        that.setData({
          allInfo: res.data,
        });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      });
    }, 1500);
  },

  jump(e) {
    let jumpto = e.currentTarget.dataset.jump;
    if (jumpto == "/pages/vip/vip") {
      jump.jump("switch", jumpto);
    } else {
      jump.jump("nav", jumpto);
    }
  }
});
