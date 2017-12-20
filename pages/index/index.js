var navbar = require("../../utils/navbar.js");
var http = require("../../utils/ajax.js");
var modal = require("../../utils/modal.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalOn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    navbar.title("功夫元");
    this.setData({
      modalOn: false,
    })
  },

  scanPayInfo() {
    let that = this;
    that.setData({
      modalOn: true,
    })
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        that.setData({
          modalOn: false,
        })
        try {
          var plateNo = res.result;
          wx.navigateTo({
            url: '/pages/scanpay/scanpay?by=scan&plateNo=' + plateNo,
          })

        } catch (e) {
          modal.modal("提示", "错误的二维码")
        }
      },
      fail() {
        that.setData({
          modalOn: false,
        })
      }
    })
  }
})