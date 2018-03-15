// pages/coupon/coupon.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    select: "useable",
    list: [
      {
        canUse: 10,
        offerMoney: 5,
        couponName: "送你的1",
        time: "2018-11-11"
      },
      {
        canUse: 20,
        offerMoney: 4,
        couponName: "送你的2",
        time: "2018-12-11"
      },
      {
        canUse: 30,
        offerMoney: 6,
        couponName: "送你的3",
        time: "2018-01-11"
      },
      {
        canUse: 40,
        offerMoney: 10,
        couponName: "送你的4",
        time: "2018-10-11"
      }
    ]
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
