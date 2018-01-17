let app = getApp();
let http = require("../../utils/ajax.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    rows: 14,
    detailList: null,
    inOut: "CONSUME_RECORD",
    tab: "out",
    more: true,
    type: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("detail.option", options);
    let type = null;
    if (options.type) {
      this.setData({
        type: options.type
      });
    }
  },
  getList() {
    let page = this.data.page;
    let type = this.data.type;
    let data = {
      vipScope: type,
      recordType: this.data.inOut,
      page: page,
      rows: this.data.rows
    };
    if (more == true) {
      let url = "/vip/getVipCardRecordPaging";
      http.ajax(url, "GET", data, app.globalData.header).then(res => {
        console.log("明细", res.data);
        if (res.data.data) {
          let list = res.data.data.rows;
          this.setData({
            detailList: list
          });
        }
      });
    }
  },
  switchTab(e) {
    let type = e.currentTarget.dataset.type;
    if (type != this.data.tab) {
      if (type == "in") {
        this.setData({
          tab: type,
          inOut: "RECHARGE_RECORD"
        });
      } else {
        this.setData({
          tab: type,
          inOut: "CONSUME_RECORD"
        });
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {}
});
