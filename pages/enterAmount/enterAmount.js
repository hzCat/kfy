// pages/enterAmount/enterAmount.js
let app = getApp();
let http = require("../../utils/ajax");
let jump = require("../../utils/jump");
let modal = require("../../utils/modal");
let turn = require("../../utils/turnto");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    storeCode: null,
    isLogin: false,
    storeAll: null,
    nowStore: null,
    money: null,
    second_step: true,
    select_card: "WECHART"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let storeCode = options.storeCode;

    let n = 0;

    wx.showLoading({
      title: "登录中",
      mask: true
    });

    var timer = setInterval(() => {
      if (app.globalData.header) {
        clearInterval(timer);
        timer = null;
        this.setData({
          storeCode: storeCode,
          isLogin: true
        });
        this.getStore(storeCode);
      } else if (n == 20) {
        clearInterval(timer);
        timer = null;
        this.setData({
          storeCode: storeCode
        });
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
        modal.modal("提示", "登录失败,请重新扫码");
      }
      n++;
      console.log(`第${n}次`);
    }, 500);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  // 获取门店选项
  getStore(storeCode) {
    http
      .ajax("/vipCommon/storeItem", "GET", {}, app.globalData.header)
      .then(res => {
        console.log(res.data);
        let obj = res.data.data;
        this.getNowStore(obj, storeCode);
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
      })
      .catch(err => {
        setTimeout(() => {
          wx.hideLoading();
        }, 1000);
        modal.modal("提示", "门店获取失败,请重新扫码");
      });
  },
  // 获取当前门店
  getNowStore(obj, storeCode) {
    let code = storeCode;
    let store = obj;
    let length = store.length;
    let thisStore = null;
    for (let i = 0; i < length; i++) {
      let one = store[i];
      if (one.codeNo == code) {
        thisStore = one;
      }
    }
    console.log(thisStore);
    this.setData({
      nowStore: thisStore
    });
  },
  // 获取输入金额
  inputMoney(e) {
    let money = turn.tostr(e.detail.value);
    this.setData({
      money: money
    });
  },
  // 提交
  submit() {
    let second_step = true;
    this.setData({
      second_step: second_step
    });
  },
  // 切换卡片
  chooseCard(e) {
    let option = e.currentTarget.dataset.card;
    if (this.data.select_card != option) {
      console.log(option);
      this.setData({
        select_card: option
      });
    }
  },
  // 获取订单选项
  getCardOptions(orderId) {
    http
      .ajax(
        "/vipPayment/getCardInfoList",
        "GET",
        { orderId: orderId },
        app.globalData.header
      )
      .then(res => {
        console.log(res.data);
      });
  },
  // 支付
  pay(){

  }
});
