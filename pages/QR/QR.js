let http = require("../../utils/ajax.js");
let navbar = require("../../utils/navbar.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    QRsrc:"../../img/default_QR.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.vipScope == "VIP") {
      navbar.title("会员二维码");
    } else if (options.vipScope == "TVIP") {
      navbar.title("团餐二维码");
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {}
});
