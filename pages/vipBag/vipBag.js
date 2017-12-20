var navbar = require("../../utils/navbar.js");

Page({

  /*** 页面的初始数据*/
  data: {
    allInfo: {},
    isManage: false,
    modalOn:false,
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    navbar.title("会员卡包");
    var that = this;
    //   从缓存获取vip的信息
    wx.getStorage({
      key: 'allInfo',
      success: function (res) {
        console.log(res)
        that.setData({
          allInfo: res.data,
          modalOn:false,
        })
      },
      fail: function (res) { },
    });
  },

  jump(e) {
    this.setData({
      modalOn:true,
    });
    var jump = e.currentTarget.dataset.jump;
    wx.navigateTo({
      url: jump,
    });
  }
})