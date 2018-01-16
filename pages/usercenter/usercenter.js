// pages/userCenter/userCenter.js
let app = getApp();
let jump = require("../../utils/jump.js");
let http = require("../../utils/ajax.js");
let storage = require("../../utils/storage.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  jump(e) {
    let jumpto = e.currentTarget.dataset.jump;
    jump.jump("nav", jumpto);
  }
});
