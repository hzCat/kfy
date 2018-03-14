let app = getApp();
let http = require("../../utils/ajax");
let turn = require("../../utils/turnto");
let modal = require("../../utils/modal");
// pages/chargeMoney_info/chargeMoney_info.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let timer = setInterval(() => {
      if (app.globalData.header) {
        wx.showLoading({
          title: "查询权益详情",
          mask: true
        });
        this.getVipCardList();
        clearInterval(timer);
        timer = null;
      }
    }, 500);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  // 获取会员卡列表
  getVipCardList() {
    http
      .ajax(
        "/vip/getVipLevelList",
        "GET",
        { vipScope: "VIP" },
        app.globalData.header
      )
      .then(res => {
        console.log("VIP卡列表信息", res);
        console.log(app.globalData.header);
        let arr = res.data.data;
        let length = arr.length;
        for (let i = 0; i < length; i++) {
          let one = arr[i];
          let gift = turn.tostr(one.rechargeGiftAmt);
          one.rechargeGiftAmt = gift;
          arr[i] = one;
        }
        this.setData(
          {
            cardList: arr
          },
          () => {
            setTimeout(() => {
              console.log(1);
              wx.hideLoading();
            }, 1000);
          }
        );
      })
      .catch(err => {
        console.log(err);
        setTimeout(() => {
          console.log(1);
          wx.hideLoading();
          modal.modal("提示", "未查到更多权益,请返回重试");
        }, 1000);
      });
  }
});
