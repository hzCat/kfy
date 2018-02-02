var jump = require("../../utils/jump.js");
var navbar = require("../../utils/navbar.js");
var http = require("../../utils/ajax.js");
var storage = require("../../utils/storage.js");
var modal = require("../../utils/modal.js");
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    third: "",
    header: {},
    pattern: "",
    cardType: "VIP",
    modalOn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options);
    wx.showLoading({
      title: "查询中",
      mask: true
    });
    // storage.gets("3rd_session").then(function(res) {
    that.setData({
      pattern: options.type,
      cardType: options.cardType
      // third: res.data,
      // header: {
      //   _yzsaas_token: res.data,
      //   "content-type": "application/x-www-form-urlencoded"
      // }
    });

    let url = null;

    if (options.type == "CONSUME_RECORD") {
      // 消费
      url = "/vip/getVipCardConsumeRecordDetail";
    } else if (options.type == "RECHARGE_RECORD") {
      // 充值
      url = "/vip/getVipCardRechargeRecordDetail";
    }

    // var url = "/vip/getVipCardRecordDetail";
    var data = {
      // recordType: options.type,
      recordId: options.id
    };
    var header = app.globalData.header;
    http
      .ajax(url, "GET", data, header)
      .then(function(res) {
        console.log(res.data.data);

        if (res.data.data) {
          let obj = res.data.data;
          that.setData({
            detail: obj
          });
        }
        wx.hideLoading();
        // else if (res.data.data.rechargeRecordDetail) {
        //   let obj = res.data.data.rechargeRecordDetail;
        //   that.setData({
        //     detail: obj,
        //     cardType: obj.vipScope
        //   });
        // }
      })
      .catch(err => {
        wx.hideLoading();
        modal.modal("提示", "未能获取详情,请返回重试");
      });
    // });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // navbar.title("消费明细")
  },

  jump(e) {
    console.log(e);
    var pattern = e.currentTarget.dataset.pattern;
    var jumpto = e.currentTarget.dataset.jump;
    this.setData(
      {
        modalOn: true
      },
      () => {
        jump.jump(pattern, jumpto);
      }
    );
  }
});
