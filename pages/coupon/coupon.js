// pages/coupon/coupon.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    select: "useable"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  select(e) {
    let select = e.currentTarget.dataset.select;
    this.setData({
      select: select
    });
  },
  useable() {
    console.log("useable");
    console.log(getApp().globalData.header);
  },
  used() {
    console.log("used");
  },
  overdue() {
    console.log("overdue");
  }
});
