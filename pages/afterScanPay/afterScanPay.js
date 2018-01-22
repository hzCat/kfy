let http = require("../../utils/ajax.js");
let app = getApp();
let jump = require("../../utils/jump.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    modalOn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      let url = "/vipPayment/afterOrderPayQuery";
      let data = { settlementId: options.id };
      http.ajax(url, "GET", data, app.globalData.header).then(res => {
        console.log(res);
        this.setData({
          detail: res.data
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  jump(e) {
    let jumpto = e.currentTarget.dataset.jump;

    this.setData(
      {
        modalOn: true
      },
      () => {
        if (jumpto == "back") {
          jump.jump("back");
        } else {
          jump.jump("redirect", jumpto);
        }
      }
    );
  }
});
