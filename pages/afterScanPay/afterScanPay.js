let http = require("../../utils/ajax.js");
let app = getApp();
let jump = require("../../utils/jump.js");
let turn = require("../../utils/turnto");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    modalOn: false,
    total: null,
    pay: null,
    offList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      let url = "/vipPayment/afterOrderPayQuery";
      let data = { settlementId: options.id };
      http.ajax(url, "GET", data, app.globalData.header).then(res => {
        console.log(res);
        let all = res.data;
        let info = all.tradeResponse;
        let total = turn.tostr(info.orderAmt);
        let pay = turn.tostr(info.payAmt);
        // 如果有优惠
        if (info.settlementOfferDetailList.length != 0) {
          let offList = info.settlementOfferDetailList;
          let offLength = offList.length;
          for (let i = 0; i < offLength; i++) {
            let obj = offList[i];
            console.log(obj, "obj");
            let offMoney = turn.tostr(obj.offerAmt);
            console.log(offMoney, "offmoney");
            obj.offerAmt = offMoney;
            offList[i] = obj;
            console.log(offList);
          }
          this.setData({
            total: total,
            pay: pay,
            offList: offList,
            detail: res.data
          });
        } else {
          this.setData({
            total: total,
            pay: pay,
            detail: res.data
          });
        }
        console.log("youhui", this.data.offList);
        // this.setData({
        //   detail: res.data
        // });
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  jump(e) {
    let jumpto = e.currentTarget.dataset.jump;

    this.setData(
      {
        modalOn: true
      },
      () => {
        if (jumpto == "back") {
          jump.jump("back");
        } else {
          jump.jump("redirect", jumpto);
        }
      }
    );
  }
});
