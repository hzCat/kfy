let jump = require("../../utils/jump.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalOn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      modalOn: false
    });
  },
  // 跳转扫码页面,带VIP类型
  toQR(e) {
    console.log("点击的类型",e.currentTarget.dataset.scope)
    let vipScope = e.currentTarget.dataset.scope;
    this.setData({
      modalOn: true
    });
    jump.jump("nav", `/pages/QR/QR?vipScope=${vipScope}`);
  },
  // 打开二维码扫描
  openScan() {
    let that = this;
    that.setData({
      modalOn: true
    });
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        that.setData({
          modalOn: false
        });
        try {
          var plateNo = res.result;
          wx.navigateTo({
            url: "/pages/waitPay/waitPay?by=scan&plateNo=" + plateNo
          });
        } catch (e) {
          modal.modal("提示", "错误的二维码");
        }
      },
      fail() {
        that.setData({
          modalOn: false
        });
      }
    });
  }
});
