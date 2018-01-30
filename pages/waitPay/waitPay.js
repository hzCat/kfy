let app = getApp();
let http = require("../../utils/ajax.js");
let jump = require("../../utils/jump.js");
let offColor = require("../../utils/offColor.js");
let cardturn = require("../../utils/cardTurn.js");
let pay = require("../../utils/pay.js");
let modal = require("../../utils/modal");
let update = require("../../utils/update");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    foodMore: 4,
    discountMore: false,
    payOption: "WECHART",
    by: null,
    orderData: null,
    offMoney: {},
    offDetail: [],
    cardList: null,
    orderId: null,
    modalOn: false,
    type: "personal",
    groupDetail: null,
    enter: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("待支付获取App.js中的header", app.globalData.header);
    console.log(options);
    let by = options.by;
    let plateNo = options.plateNo;
    let id = options.id;
    let type = options.type;
    // 加载等待
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    // 设置进入类型
    this.setData({
      enter: options.by
    });
    if (type == "group") {
      this.setData({
        type: type
      });
    }
    if (by == "scan") {
      this.getOrder(by, plateNo, id);
    } else if (by == "orderlist") {
      this.getOrder(by, id, id);
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  // 拉取订单数据(来源 ; 数据:可以是餐盘号,也可以是id ; 订单id)
  getOrder(by, myData, orderId) {
    let that = this;
    let header = app.globalData.header;
    let scanUrl = "/vipOrder/findOrder";
    let listUrl = "/vipOrder/getOrderDetail";
    // 扫码进入
    if (by == "scan") {
      if (myData != "undefined") {
        let data = { plateNo: myData };
        http.ajax(scanUrl, "GET", data, header).then(res => {
          console.log("获取扫码订单数据", res.data.data);
          if (res.data.code == 200 && res.data.data != null) {
            let orderId = res.data.data.id;
            that.setData({
              orderData: res.data.data,
              offMoney: res.data.data,
              orderId: res.data.data.id
            });

            // 获取可用卡
            that.getUserCard(orderId, true);
          } else {
            that.noOrder(by);
          }
        });
      } else {
        this.noOrder(by);
      }
      // 订单进入
    } else if (by == "orderlist") {
      let data = {
        orderId: myData
      };
      http.ajax(listUrl, "GET", data, header).then(res => {
        console.log("订单进入拉取数据", res.data.data);
        if (res.data.code == 200 && res.data.data != null) {
          if (res.data.data.deliveryInfoResponse) {
            that.setData({
              orderData: res.data.data,
              offMoney: res.data.data,
              orderId: orderId,
              groupDetail: res.data.data.deliveryInfoResponse
            });
          } else {
            that.setData({
              orderData: res.data.data,
              offMoney: res.data.data,
              orderId: orderId
            });
          }
          that.getUserCard(orderId, true);
        } else {
          that.noOrder(by);
        }
      });
    } else {
      that.noOrder();
    }
  },
  // 获取可用卡
  getUserCard(orderId, offmoney) {
    let that = this;
    let url = "/vipPayment/getCardInfoList";
    let method = "GET";
    let data = {
      orderId: orderId
    };
    http.ajax(url, method, data, app.globalData.header).then(res => {
      console.log("可用卡", res.data);
      // 命名不同,判断一下
      // if (res.data.data.defaultPayChannel != "WECHART") {
      let arr = cardturn.turn(res.data.data.settlementInfoList);
      console.log("转换之后的可用卡", arr);
      that.setData({
        cardList: arr,
        payOption: res.data.data.defaultPayChannel
      });
      // } else if (res.data.data.defaultPayChannel == "WECHART") {
      //   that.setData({
      //     cardList: res.data.data,
      //     payOption: "wechat"
      //   });
      // }

      //是否获取优惠
      if (offmoney) {
        that.getDiscount(
          that.data.orderData.id,
          res.data.data.defaultPayChannel
        );
      }
    });
  },
  // 获取优惠
  getDiscount(id, payChannel) {
    let that = this;
    let url = "/vipPayment/quickPayPre";
    let method = "GET";
    let data = {
      id: id,
      payChannel: payChannel
    };
    http.ajax(url, method, data, app.globalData.header).then(res => {
      console.log("优惠信息", res.data);
      // 如果存在
      if (res.data.data) {
        let offlist = res.data.data.offerList;
        let arr = offColor.turn(offlist);
        that.setData({
          orderData: res.data.data.orderResponseList[0],
          offMoney: res.data.data,
          offDetail: arr
        });
      }
      // 关闭加载等待框
      wx.hideLoading();
    });
  },
  // 查不到订单
  noOrder(by) {
    jump.jump("redirect", `/pages/hasNoOrder/hasNoOrder?by=${by}`);
  },
  // //扫描进入查询订单
  // orderByScan(plateNo) {
  //   let url = "/vipOrder/findOrder";
  //   let data = { plateNo: plateNo };
  //   http.ajax(url, "GET", data, app.globalData.header).then(res => {
  //     console.log("扫码查询订单", res.data);
  //   });
  // },
  // //订单页进入查询订单
  // orderByList(id) {
  //   let url = "/vipOrder/getOrderDetail";
  //   let data = { orderId: id };
  //   http.ajax(url, "GET", data, app.globalData.header).then(res => {
  //     console.log("订单页查询订单", res.data);
  //   });
  // },

  // 切换支付频道
  // payOption(e) {
  //   let that = this;
  //   let option = e.currentTarget.dataset.option;
  //   let id = this.data.orderData.id;
  //   this.setData({
  //     payOption: option
  //   });
  //   console.log("当前支付频道", this.data.payOption);
  //   let url = "/vipPayment/quickPayPre";
  //   let data = {
  //     id: id,
  //     payChannel: option
  //   };
  //   http.ajax(url, "GET", data, app.globalData.header).then(res => {
  //     console.log(`${option}下的优惠信息`, res.data);
  //     that.setData({
  //       offMoney: res.data.data
  //     });
  //   });
  // },
  // 显示更多
  showMore(e) {
    let type = e.currentTarget.dataset.type;
    // let food = !this.data.foodMore;
    let discount = !this.data.discountMore;
    let length = this.data.orderData.detailList.length;
    if (type == "food") {
      if (this.data.foodMore == 4) {
        this.setData({
          foodMore: length
        });
      } else {
        this.setData({
          foodMore: 4
        });
      }
    } else if (type == "discount") {
      this.setData({
        discountMore: discount
      });
    }
  },
  jump(e) {
    this.setData({
      modalOn: true
    });
    let jumpto = e.currentTarget.dataset.jump;
    jump.jump("nav", jumpto);
  }
});