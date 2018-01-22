let jump = require("../../utils/jump.js");
let http = require("../../utils/ajax.js");
let scan = require("../../utils/scanQR.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    orderPrice: null,
    isSucc: "false",
    by: null,
    code: null,
    tips: null,
    modalOn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      orderId: options.orderId,
      orderPrice: options.money,
      isSucc: options.isSucc,
      by: options.by,
      code: options.code
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.by == "card") {
      let code = this.data.code;
      if (code == 400) {
        this.setData({
          tips: "订单不存在"
        });
      } else if (code == 402) {
        this.setData({
          tips: "登录过期"
        });
      } else if (code == 403) {
        this.setData({
          tips: "订单状态有误"
        });
      } else if (code == 414 || code == 650) {
        this.setData({
          tips: "参数错误"
        });
      } else if (code == 500) {
        this.setData({
          tips: "发生错误"
        });
      } else if (code == 5009) {
        this.setData({
          tips: "优惠金额不合法"
        });
      } else if (code == 5012) {
        this.setData({
          tips: "订单已过期"
        });
      } else if (code == 6001) {
        this.setData({
          tips: "支付渠道不支持"
        });
      } else if (code == 6002) {
        this.setData({
          tips: "会员卡余额不足"
        });
      }
    }
  },
  quit(e) {
    this.setData({
      modalOn: true
    });
    let jumpto = e.currentTarget.dataset.jump;
    jump.jump("rel", jumpto);
  },
  again() {
    this.setData({
      modalOn: true
    });
    let by = this.data.by;
    scan.refresh(by);
  }
});
