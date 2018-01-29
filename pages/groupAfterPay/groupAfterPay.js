let http = require("../../utils/ajax.js");
let app = getApp();
let jump = require("../../utils/jump.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    modalOn: false,
    showNum: 2
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
  // 显示更多
  showMore() {
    let length = this.data.detail.orderList.length;
    if (this.data.showNum == 2) {
      this.setData({
        showNum: length
      });
    } else {
      this.setData({
        showNum: 2
      });
    }
  },
  jump(e) {
    this.setData({
      modalOn: true
    });
    let jumpto = e.currentTarget.dataset.jump;
    if (jumpto == "back") {
      jump.jump("back");
    } else {
      jump.jump("redirect", jumpto);
    }
  }
});
