let app = getApp();
let http = require("../../utils/ajax.js");
let storage = require("../../utils/storage.js");
let card = require("../../utils/cardTurn.js");
let jump = require("../../utils/jump.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    vipCardList: [],
    tvipCardList: [],
    vipWidth: "750",
    tvipWidth: "750",
    cardType: "personal",
    nowCard: [],
    allInfo: {},
    list: [],
    isVip: [],
    vipLevel: null,
    tvipLevel: null,
    nowIndex: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    storage.gets("allInfo").then(res => {
      console.log("vip加载allInfo", res.data);
      let arr = card.turn(res.data.vipCardList);
      let vipArr = card.getvip(res.data.vipCardList);
      console.log(arr);
      console.log(vipArr);
      this.setData({
        allInfo: res.data,
        list: arr,
        isVip: vipArr
      });
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  onReady() {
    this.getVipList();
    this.getTvipList();
  },
  // 获取个人列表
  getVipList() {
    let that = this;
    let data = {
      vipScope: "VIP"
    };
    http
      .ajax("/vip/getVipLevelList", "GET", data, app.globalData.header)
      .then(res => {
        console.log("个人卡列表", res.data.data);
        let level = card.level(res.data.data);
        console.log("个卡开通等级", level);
        let l = res.data.data.length;
        let w = 750 * l - 130 * (l - 1);
        that.setData({
          vipCardList: res.data.data,
          vipWidth: w,
          vipLevel: level
        });
      });
  },
  // 获取团餐列表
  getTvipList() {
    let that = this;
    let data = {
      vipScope: "TVIP"
    };
    http
      .ajax("/vip/getVipLevelList", "GET", data, app.globalData.header)
      .then(res => {
        console.log("团卡列表", res.data.data);
        let level = card.level(res.data.data);
        console.log("团餐开通等级", level);
        let l = res.data.data.length;
        let w = 750 * l - 130 * (l - 1);
        that.setData({
          tvipCardList: res.data.data,
          tvipWidth: w,
          tvipLevel: level
        });
      });
  },

  // 个卡团卡切换
  boxSwitch(e) {
    let type = e.currentTarget.dataset.type;
    if (this.data.cardType != type) {
      this.setData({
        cardType: type
      });
    }
  },
  // 传出的index变化
  indexChange(e) {
    console.log("传出的数据", e.detail);
    let cardIndex = e.detail.index;
    console.log("nowIndex", cardIndex);
    this.setData({
      nowIndex: cardIndex
    });
    this.nowShowCard(cardIndex);
  },
  // 现在显示的卡
  nowShowCard(index) {
    let groupCard = this.data.tvipCardList;
    let personalCard = this.data.vipCardList;
    let nowCardList = null;
    let nowCard = [];
    if (this.data.cardType == "group") {
      nowCardList = groupCard;
    } else if (this.data.cardType == "personal") {
      nowCardList = personalCard;
    }
    nowCard = nowCardList[index];
    if (nowCard) {
      this.setData({
        nowCard: nowCard
      });
      console.log("现在的卡列表", nowCard);
    }
  },
  jump(e) {
    let jumpto = e.currentTarget.dataset.jump;
    jump.jump("nav", jumpto);
  }
});