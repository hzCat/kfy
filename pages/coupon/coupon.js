let app = getApp();
let http = require("../../utils/ajax");
let turnto = require("../../utils/turnto");
let modal = require("../../utils/modal");
// pages/coupon/coupon.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    select: "useable",
    page_one: 1,
    page_two: 1,
    page_three: 1,
    list_one: [],
    list_two: [],
    list_three: [],
    more_one: true,
    more_two: true,
    more_three: true,
    length_one: 0,
    length_two: 0,
    length_three: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    setTimeout(() => {
      this.getCoupon(this.data.select);
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  select(e) {
    let select = e.currentTarget.dataset.select;
    this.getCoupon(select);
    this.setData({
      select: select
    });
  },
  // 可用触底刷新
  useable() {
    if (this.data.more_one) {
      console.log("useable");
      this.getCoupon(this.data.select);
    }
  },
  // 已经使用触底刷新
  used() {
    console.log("used");
    if (this.data.more_two) {
      console.log("used");
      this.getCoupon(this.data.select);
    }
  },
  // 过期触底刷新
  overdue() {
    if (this.data.more_three) {
      console.log("overdue");
      this.getCoupon(this.data.select);
    }
  },
  // 切割时间
  cuttime(rows) {
    if (rows.length > 0) {
      let length = rows.length;
      for (let i = 0; i < length; i++) {
        let one = rows[i];
        let time = turnto.cuttime(one.validTime, 0, 10);
        one.validTime = time;
        rows[i] = one;
      }
      return rows;
    } else {
      return [];
    }
  },
  // 获取卡券
  getCoupon(nowStatus) {
    let that = this;
    let status = null;
    let page1 = that.data.page_one;
    let page2 = that.data.page_two;
    let page3 = that.data.page_three;
    let more = null;
    let p = null;
    if (nowStatus == "useable") {
      more = this.data.more_one;
      p = page1;
      status = "USABLE";
    } else if (nowStatus == "used") {
      status = "USED";
      p = page2;
      more = this.data.more_two;
    } else if (nowStatus == "overdue") {
      status = "EXPIRED";
      p = page3;
      more = this.data.more_three;
    }

    if (more) {
      wx.showLoading({
        title: "获取优惠券",
        mask: true
      });
      http
        .ajax(
          "/vipCoupon/findPaging",
          "GET",
          { page: p, rows: 10, couponStatus: status },
          app.globalData.header
        )
        .then(res => {
          if (res.data.data) {
            console.log("拉取奖券", res.data.data.rows);
            let rows = res.data.data.rows;

            rows = this.cuttime(rows);
            // 可不可以获取更多
            let more = false;
            let list = null;
            // 判断类型和长度
            if (rows.length < 10) {
              if (nowStatus == "useable") {
                list = that.data.list_one;
              } else if (nowStatus == "used") {
                list = that.data.list_two;
              } else if (nowStatus == "overdue") {
                list = that.data.list_three;
              }
              more = false;
            } else {
              if (nowStatus == "useable") {
                list = that.data.list_one;
                page1++;
              } else if (nowStatus == "used") {
                list = that.data.list_two;
                page2++;
              } else if (nowStatus == "overdue") {
                list = that.data.list_three;
                page3++;
              }
              more = true;
            }
            console.log(more);
            if (rows.length > 0) {
              list = list.concat(rows);
            }
            console.log(list);
            let listLength = list.length;
            console.log(listLength);
            // 判断类型
            if (nowStatus == "useable") {
              that.setData({
                list_one: list,
                page_one: page1,
                more_one: more,
                length_one: listLength
              });
            } else if (nowStatus == "used") {
              that.setData({
                list_two: list,
                page_two: page2,
                more_two: more,
                length_two: listLength
              });
            } else if (nowStatus == "overdue") {
              that.setData({
                list_three: list,
                page_three: page3,
                more_three: more,
                length_three: listLength
              });
            }
            setTimeout(() => {
              wx.hideLoading();
            }, 1000);
          }
        })
        .catch(err => {
          console.log(err);
          wx.hideLoading();
          modal.modal("提示", "暂时无法获取您的优惠券,请返回重试");
        });
    }
  }
});
