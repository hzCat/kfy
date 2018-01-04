var navbar = require("../../utils/navbar.js");
var storage = require("../../utils/storage.js");
var http = require("../../utils/ajax.js");

Page({

  /*** 页面的初始数据*/
  data: {
    allInfo: {},
    isManage: false,
    modalOn: false,
    tvipInfo:null,
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {

  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    // navbar.title("会员卡包");
    var that = this;
    //   从缓存获取vip的信息
    wx.getStorage({
      key: 'allInfo',
      success: function (res) {
        console.log(res)
        that.setData({
          allInfo: res.data,
          modalOn: false,
        })
      },
      fail: function (res) {},
    });
    let url = "/tvip/getApplyOrderInfo";
    storage.gets("3rd_session")
      .then(function (res) {
        let header = {
          '_yzsaas_token': res.data,
          "content-type": "application/x-www-form-urlencoded"
        }
        http.ajax(url, "GET", {}, header)
          .then(function (res) {
            console.log("tvipInfo",res.data)
            that.setData({
              tvipInfo:res.data.data
            })
          })
      })
  },

  jump(e) {
    this.setData({
      modalOn: true,
    });
    var jump = e.currentTarget.dataset.jump;
    wx.navigateTo({
      url: jump,
    });
  }
})