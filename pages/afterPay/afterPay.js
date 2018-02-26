let jump = require("../../utils/jump.js");
let http = require("../../utils/ajax.js");
let scan = require("../../utils/scanQR.js");
let turn = require("../../utils/turnto.js");
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
    modalOn: false,
    type: "personal",
    enter: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let price = turn.tostr(options.money);
    this.setData({
      orderId: options.orderId,
      orderPrice: price,
      isSucc: options.isSucc,
      by: options.by,
      code: options.code,
      type: options.type,
      enter: options.enter
    });
    console.log(this.data.orderId);
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
  // 完全退出
  quit(e) {
    let jumpto = e.currentTarget.dataset.jump;

    this.setData(
      {
        modalOn: true
      },
      () => {
        jump.jump("switch", jumpto);
      }
    );
  },
  // 再扫一个
  again() {
    this.setData({
      modalOn: true
    });
    if (this.data.type == "group") {
      jump.jump("back");
    }else{
      jump.jump("rel", "/pages/index/index?scanAgain=true");
    }
    // let by = this.data.enter;
    // scan.refresh(by);
  }
});
