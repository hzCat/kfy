// pages/shareGift/shareGift.js
let storage = require("../../utils/storage");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inviteCode: "",
    actId: "",
    actAll: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    storage.gets("allInfo").then(res => {
      console.log(res.data);
      this.setData({
        inviteCode: res.data.selfInviteCode
      });
    });
    storage.gets("hasAct").then(res => {
      console.log(res.data);
      this.setData({
        actId: res.data.id,
        actAll: res.data
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let that = this;
    let title="只有功夫会员才有的福利哦,快来和我一起拆红包吧"
    let pathUrl = `/pages/index/index?invite=${that.data.inviteCode}&actid=${
      that.data.actId
    }`;
    console.log(pathUrl);
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log("share button", res.target);
    }
    return {
      title: title,
      path: pathUrl,
      success: function(res) {
        // 转发成功
        console.log(" 转发成功");
      },
      fail: function(res) {
        // 转发失败
      }
    };
  }
});
