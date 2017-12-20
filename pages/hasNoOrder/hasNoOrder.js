var navbar = require("../../utils/navbar.js")
var util = require("../../utils/util.js")
var http = require("../../utils/ajax.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    by: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      by: options.by
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // navbar.title("支付详情")
  },

  refresh() {
    let that = this;
    if (that.data.by == "scan") {
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          try {
            var plateNo = res.result;
            wx.redirectTo({
              url: '/pages/scanpay/scanpay?by=scan&plateNo=' + plateNo,
            })
          } catch (e) {
            modal.modal("提示", "错误的二维码")
          }
        },
        fail() {
        }
      })
    } else if (that.data.by == "orderlist") {
      util.jump("switch", "/pages/usercenter/usercenter")
    } else {
      util.jump("switch", "/pages/index/index")
    }
  }
})