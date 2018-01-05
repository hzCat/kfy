var util = require("../../utils/util.js");
var navbar = require("../../utils/navbar.js");

Page({
  /*** 页面的初始数据*/
  data: {
    allInfo: {},
    vipCardList: [],
    modalOn: false
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function(options) {},

  /*** 生命周期函数--监听页面显示*/
  onShow: function() {
    // navbar.title("会员卡充值");
    var that = this;
    wx.getStorage({
      key: "allInfo",
      success: function(res) {
        console.log("卡列表", res.data.vipCardList);
        let cardList = res.data.vipCardList;
        let arr = [];
        // VIP下标为0,TVIP下标为1
        if (cardList.length == 0) {
          arr = [];
        } else {
          for (let i = 0; i < cardList.length; i++) {
            let obj = cardList[i];
            if (obj.vipScope == "VIP") {
              arr[0] = obj;
            }
            if (obj.vipScope == "TVIP") {
              arr[1] = obj;
            }
          }
          console.log("修改后的", arr);
        }
        // 重新复制allInfo中的vipCardList
        let all = res.data;
        all.vipCardList = arr;
        that.setData({
          modalOn: false,
          allInfo: all,
          vipCardList: arr
        });
      },
      fail() {
        that.setData({
          modalOn: false
        });
      }
    });
  },

  jump(e) {
    this.setData({
      modalOn: true
    });
    var jump = e.currentTarget.dataset.jump;
    var pattern = e.currentTarget.dataset.pattern;
    util.jump(pattern, jump);
  }
});
