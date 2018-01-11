let app = getApp();
let http = require("../../utils/ajax.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    vipCardList: [],
    tvipCardList: [],
    vipWidth: "750",
    tvipWidth: "750"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getVipList();
    this.getTvipList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  // 获取个人列表
  getVipList() {
    let that = this;
    let data = {
      vipScope: "VIP"
    };
    http
      .ajax("/vip/getVipLevelList", "GET", data, app.globalData.header)
      .then(res => {
        console.log("个人卡列表", res.data);
        let l = res.data.data.length;
        let w = 750 * l - 130 * (l - 1);
        that.setData({
          vipCardList: res.data.data,
          vipWidth: w
        });
      });
  },

  // 获取团餐列表
  getTvipList() {
    let that = this;
    let data = {
      vipScope: "TVIP"
    };
    http
      .ajax("/vip/getVipLevelList", "GET", data, app.globalData.header)
      .then(res => {
        console.log("团卡列表", res.data);
        let l = res.data.data.length;
        let w = 750 * l - 130 * (l - 1);
        that.setData({
          tvipCardList: res.data.data,
          tvipWidth: w
        });
      });
  }
});
