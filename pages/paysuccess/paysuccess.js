var navbar = require("../../utils/navbar.js");
var util = require("../../utils/util.js");
var modal = require("../../utils/modal.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    orderPrice: null,
    isSucc: 'false',
    by: null,
    code: null,
    tips: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderId: options.orderId,
      orderPrice: options.money,
      isSucc: options.isSucc,
      by: options.by,
      code: options.code,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // navbar.title("支付详情")
    if (this.data.by == "card") {
      let code = this.data.code;
      if (code == 400) {
        this.setData({
          tips: "订单不存在"
        })
      } else if (code == 402) {
        this.setData({
          tips: "登录过期"
        })
      } else if (code == 403) {
        this.setData({
          tips: "订单状态有误"
        })
      } else if (code == 414 || code == 650) {
        this.setData({
          tips: "参数错误"
        })
      } else if (code == 500) {
        this.setData({
          tips: "发生错误"
        })
      } else if (code == 5009) {
        this.setData({
          tips: "优惠金额不合法"
        })
      } else if (code == 5012) {
        this.setData({
          tips: "订单已过期"
        })
      } else if (code == 6001) {
        this.setData({
          tips: "支付渠道不支持"
        })
      } else if (code == 6002) {
        this.setData({
          tips: "会员卡余额不足"
        })
      }
    }
  },

  //   再扫一次
  scanPayInfo() {
    let that = this;
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
  },

  //   跳转个人中心
  jumpToCenter() {
    wx.switchTab({
      url: '/pages/usercenter/usercenter',
    })
  },
  
  // 失败的按钮
  failBtnClick() {
    let by = this.data.by;
    let code = this.data.code;
    if (by == "wechat") {
      util.jump("back")
    }
    else if (by == "card") {
      if (code == 402) {
        wx.showLoading({
          title: '重新登陆中',
          mask:true,
        })
        // 登录
        app.login()
        setTimeout(function () {
          wx.hideLoading();
          util.jump("rel", "/pages/index/index")
        }, 2000)
      } else if (code == 500 || code == 6001 || code == 5009) {
        util.jump("back")
      } else {
        util.jump("rel", "/pages/index/index")
      }
    }
  }
})