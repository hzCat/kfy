let util = require("../../utils/util.js");
let navbar = require("../../utils/navbar.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSuccess: "false",
    orderNo: null,
    level: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isSuccess: options.isSucc,
      orderNo: options.orderNo,
      level: options.name
    })
  },

  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    if (this.data.isSuccess == "true") {
      navbar.title("购买成功")
    } else if (this.data.isSuccess == "false") {
      navbar.title("购买失败")
    } 
  },
  jump(e) {
    util.jump("switch", "/pages/usercenter/usercenter");
  }
})