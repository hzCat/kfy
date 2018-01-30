// pages/yourMoney/yourMoney.js
let turn = require("../../utils/turnto");
let storage = require("../../utils/storage.js");
let card = require("../../utils/cardTurn.js");
let jump = require("../../utils/jump.js");
let navbar = require("../../utils/navbar");
let modal = require("../../utils/modal");
let app = getApp();
let http = require("../../utils/ajax");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    by: "personal",
    cardList: [],
    isVip: [],
    modalOn: false,
    p_total: null,
    t_total: null,
    p_charge: null,
    t_charge: null,
    p_gift: null,
    t_gift: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let type = options.by;
    if (type == "group") {
      navbar.title("团卡余额");
    } else if (type == "personal") {
      navbar.title("个人余额");
    }
    this.setData({
      by: type
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: "查询中",
      mask: true
    });
    // 卡列表获取
    let url = "/vip/getVipCardList";
    http
      .ajax(url, "GET", {}, app.globalData.header)
      .then(res => {
        console.log("余额页面获取的卡信息", res.data);
        let list = res.data.data;
        let arr = card.turn(list);
        let arr2 = card.getvip(list);
        console.log(111);
        let p_total = turn.tostr(arr[0].cardBalance);
        let t_total = turn.tostr(arr[1].cardBalance);
        console.log(p_total, t_total);

        let p_charge = turn.tostr(arr[0].totalRecharge);
        let t_charge = turn.tostr(arr[1].totalRecharge);
        console.log(p_charge, t_charge);

        let p_gift = turn.tostr(arr[0].totalGift);
        let t_gift = turn.tostr(arr[1].totalGift);
        console.log(p_gift, t_gift);

        // console.log(arr2);
        this.setData({
          cardList: arr,
          isVip: arr2,
          p_total: p_total,
          t_total: t_total,
          p_charge: p_charge,
          t_charge: t_charge,
          p_gift: p_gift,
          t_gift: t_gift
        });
        wx.hideLoading();
      })
      .catch(err => {
        console.log(err);
        wx.hideLoading();
        modal.modal("提示", "网络差,请稍后再试");
      });

    // 缓存获取,有延迟
    // storage.gets("allInfo").then(res => {
    //   let list = res.data.vipCardList;
    //   let arr = card.turn(list);
    //   let arr2 = card.getvip(list);
    //   this.setData({
    //     cardList: arr,
    //     isVip: arr2
    //   });
    // });
  },
  jump(e) {
    this.setData({
      modalOn: true
    });
    let jumpto = e.currentTarget.dataset.jump;
    jump.jump("nav", jumpto);
  }
});
