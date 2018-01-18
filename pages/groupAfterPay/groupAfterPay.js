let http = require("../../utils/ajax.js");
let app = getApp();
let jump = require("../../utils/jump.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let url = "/vipPayment/afterOrderPayQuery";
    let data = { settlementId: options.id };
    http.ajax(url, "GET", data, app.globalData.header).then(res => {
      console.log(res.data);
      this.setData({
        detail: res.data.tradeResponse
      });
    });
  },
  jump(e) {
    let jumpto = e.currentTarget.dataset.jump;
    if (jumpto == "back") {
      jump.jump("back");
    } else {
      jump.jump("redirect", jumpto);
    }
  }
});
