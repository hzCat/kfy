// pages/yourMoney/yourMoney.js
let storage = require("../../utils/storage.js");
let card = require("../../utils/cardTurn.js");
let jump = require("../../utils/jump.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardList: [],
    isVip: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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
    let jumpto = e.currentTarget.dataset.jump;
    jump.jump("nav", jumpto);
  }
});
