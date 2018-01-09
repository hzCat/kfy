let app = getApp();
let http = require("../../utils/ajax.js");
let jump = require("../../utils/jump.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    foodMore: false,
    discountMore: false,
    payOption: "wechat"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData.header);
    console.log(options);
    let by = options.by;
    let plateNo = options.plateNo;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  // 获取可用卡
  getUserCard(storeId, offmoney) {
    let url = "/vipPayment/getCardInfoList";
    let method = "GET";
    let data = {
      storeId: storeId
    };
    http.ajax(url, method, data, app.globalData.header).then(res => {
      conosole.log("可用卡", res.data);
    });
  },
  // 获取优惠
  getDiscount(id, payChannel) {
    let url = "/vipPayment/quickPayPre";
    let method = "GET";
    let data = {
      id: id,
      payChannel: payChannel
    };
    http.ajax(url, method, data, app.globalData.header).then(res => {
      console.log("优惠信息", res.data);
    });
  },
  // 查不到订单
  noOrder(by) {
    jump.jump("redirect", `/pages/noOrder/noOrder?by=${by}`);
  },
  //扫描进入查询订单
  orderByScan(plateNo) {
    let url = "/vipOrder/findOrder";
    let data = { plateNo: plateNo };
    http.ajax(url, "GET", data, app.globalData.header).then(res => {
      console.log("扫码查询订单", res.data);
    });
  },
  //订单页进入查询订单
  orderByList(id) {
    let url = "/vipOrder/getOrderDetail";
    let data = { orderId: id };
    http.ajax(url, "GET", data, app.globalData.header).then(res => {
      console.log("订单页查询订单", res.data);
    });
  },
  // 切换支付频道
  payOption(e) {
    let option = e.currentTarget.dataset.option;
    this.setData({
      payOption: option
    });
    console.log(this.data.payOption);
  },
  // 显示更多
  showMore(e) {
    let type = e.currentTarget.dataset.type;
    let food = !this.data.foodMore;
    let discount = !this.data.discountMore;
    if (type == "food") {
      this.setData({
        foodMore: food
      });
    } else if (type == "discount") {
      this.setData({
        discountMore: discount
      });
    }
  },
  // 支付按钮
  payClick() {}
});
