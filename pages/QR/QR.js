let http = require("../../utils/ajax.js");
let navbar = require("../../utils/navbar.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    QRsrc:"../../img/default_QR.png",
    vipScope:'VIP',
    isVip:false,
    isTvip:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      vipScope:options.vipScope,
    })
    if (options.vipScope == "VIP") {
      navbar.color("#ffffff","#efac40");
    } else if (options.vipScope == "TVIP") {
      navbar.color("#ffffff","#d6524a");
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {}
});
