// pages/enterAmountOffer/enterAmountOffer.js
let color = require("../../utils/offColor");
let storage = require("../../utils/storage");
let modal = require("../../utils/modal");
let jump = require("../../utils/jump");
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    offerList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.showLoading({
      title: "查询中",
      mask: true
    });
    let n = 0;
    var timer = setInterval(() => {
      wx.getStorageInfo({
        success: function(res) {
          console.log(res.keys);
          console.log(n);
          let storageList = res.keys;
          let length = storageList.length;
          for (let i = 0; i < length; i++) {
            let one = storageList[i];
            if (one == "enterAmountOfferList") {
              storage.gets("enterAmountOfferList").then(res => {
                clearInterval(timer);
                timer = null;
                let list = res.data.offerList;
                console.log(list);

                that.changeList(list);
                setTimeout(() => {
                  wx.hideLoading();
                }, 1000);
              });
            }
          }
        }
      });
      n++;
      if (n == 10) {
        clearInterval(timer);
        timer = null;
        let succ = function() {
          jump.jump("back");
        };
        setTimeout(() => {
          wx.hideLoading();
          modal.modal("提示", "获取优惠详情失败,请返回重试", false, succ());
        }, 1000);
      }
    }, 500);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  changeList(arr) {
    let arr1 = color.turn(arr);
    this.setData({
      offerList: arr1
    });
  }
});
