var util = require("../../utils/util.js")
var navbar = require("../../utils/navbar.js")

Page({

  /*** 页面的初始数据*/
  data: {
    allInfo: {},
    vipCardList: [],
    modalOn: false,
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {

  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    // navbar.title("会员卡充值");
    var that = this;
    wx.getStorage({
      key: 'allInfo',
      success: function (res) {
        console.log(res.data.vipCardList)
        that.setData({
          modalOn: false,
          allInfo: res.data,
          vipCardList: res.data.vipCardList
        })
      },
      fail(){
        that.setData({
          modalOn: false,
        })
      }
    })
  },

  jump(e) {
    this.setData({
      modalOn: true,
    });
    var jump = e.currentTarget.dataset.jump;
    var pattern = e.currentTarget.dataset.pattern;
    util.jump(pattern, jump)
  }
})