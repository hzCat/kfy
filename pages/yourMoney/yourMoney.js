// pages/yourMoney/yourMoney.js
let storage = require("../../utils/storage.js");
let card = require("../../utils/cardTurn.js");
let jump = require("../../utils/jump.js");
let navbar = require("../../utils/navbar");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    by: "personal",
    cardList: [],
    isVip: [],
    modalOn: false
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
    storage.gets("allInfo").then(res => {
      let list = res.data.vipCardList;
      let arr = card.turn(list);
      let arr2 = card.getvip(list);
      this.setData({
        cardList: arr,
        isVip: arr2
      });
    });
  },
  jump(e) {
    this.setData({
      modalOn: true
    });
    let jumpto = e.currentTarget.dataset.jump;
    jump.jump("nav", jumpto);
  }
});
