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
    showNum: 2,
    total: null,
    pay: null,
    offList: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let url = "/vipPayment/afterOrderPayQuery";
    let data = { settlementId: options.id };
    http.ajax(url, "GET", data, app.globalData.header).then(res => {
      console.log(res.data);
      let all = res.data.tradeResponse;
      let total = turn.tostr(all.orderAmt);
      let pay = turn.tostr(all.payAmt);
      if (all.settlementOfferDetailList) {
        let offList = all.settlementOfferDetailList;
        let offLength = offList.length;
        for (let i = 0; i < offLength; i++) {
          let obj = offList[i];
          let offmoney = turn.tostr(obj.offerAmt);
          obj.offerAmt = offmoney;
          offList[i] = obj;
        }
        this.setData({
          detail: all,
          total: total,
          pay: pay,
          offList: offList
        });
      } else {
        this.setData({
          detail: all,
          total: total,
          pay: pay,
        });
      }
    });
  },
  // 显示更多
  showMore() {
    let length = this.data.detail.orderList.length;
    if (this.data.showNum == 2) {
      this.setData({
        showNum: length
      });
    } else {
      this.setData({
        showNum: 2
      });
    }
  },
  jump(e) {
    this.setData({
      modalOn: true
    });
    let jumpto = e.currentTarget.dataset.jump;
    if (jumpto == "back") {
      jump.jump("back");
    } else {
      jump.jump("redirect", jumpto);
    }
  }
});
