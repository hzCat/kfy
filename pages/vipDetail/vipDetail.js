let app = getApp();
let http = require("../../utils/ajax.js");
let navbar = require("../../utils/navbar.js");
let jump = require("../../utils/jump.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageOne: 1,
    pageTwo: 1,
    rows: 14,
    detailList: [],
    detailListTwo: [],
    inOut: "CONSUME_RECORD",
    tab: "out",
    moreOne: true,
    moreTwo: true,
    type: null,
    modalOn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("detail.option", options);
    let type = null;
    if (options.type) {
      this.setData({
        type: options.type
      });
    }
    if (type == "VIP") {
      navbar.title("个卡明细");
    } else if (type == "TVIP") {
      navbar.title("团卡明细");
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getList();
  },
  getList() {
    let page = null;
    if (this.data.tab == "out") {
      page = this.data.pageOne;
    } else if (this.data.tab == "in") {
      page = this.data.pageTwo;
    }
    let type = this.data.type;
    let data = {
      vipScope: type,
      recordType: this.data.inOut,
      page: page,
      rows: this.data.rows
    };
    if (
      (this.data.moreOne == true && this.data.tab == "out") ||
      (this.data.moreTwo == true && this.data.tab == "in")
    ) {
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      let url = "/vip/getVipCardRecordPaging";
      http
        .ajax(url, "GET", data, app.globalData.header)
        .then(res => {
          console.log("明细", res.data);
          if (res.data.data) {
            let list = res.data.data.rows;
            let newLength = list.length;
            let hasList = [];
            if (this.data.inOut == "CONSUME_RECORD") {
              hasList = this.data.detailList;
            } else if (this.data.inOut == "RECHARGE_RECORD") {
              hasList = this.data.detailListTwo;
            }
            let nowList = hasList.concat(list);
            // let nowPage = this.data.page;
            if (newLength < 14) {
              if (this.data.inOut == "CONSUME_RECORD") {
                this.setData({
                  detailList: nowList,
                  moreOne: false
                });
              } else if (this.data.inOut == "RECHARGE_RECORD") {
                this.setData({
                  detailListTwo: nowList,
                  moreTwo: false
                });
              }
            } else {
              if (this.data.inOut == "CONSUME_RECORD") {
                this.setData({
                  detailList: nowList,
                  pageOne: page + 1
                });
              } else if (this.data.inOut == "RECHARGE_RECORD") {
                this.setData({
                  detailListTwo: nowList,
                  pageTwo: page + 1
                });
              }
            }
            setTimeout(function() {
              wx.hideLoading();
            }, 1000);
          }
        })
        .catch(err => {
          setTimeout(function() {
            wx.hideLoading();
          }, 1000);
        });
    }
  },
  switchTab(e) {
    let type = e.currentTarget.dataset.type;
    if (type != this.data.tab) {
      if (type == "in") {
        navbar.title("充值明细")
        this.setData({
          tab: type,
          inOut: "RECHARGE_RECORD"
        });
      } else {
        navbar.title("消费明细")
        
        this.setData({
          tab: type,
          inOut: "CONSUME_RECORD"
        });
      }
      this.getList();
    }
  },
  onReachBottom() {
    this.getList();
  },
  jump(e) {
    this.setData({
      modalOn: true
    });
    let jumpto = e.currentTarget.dataset.jump;
    jump.jump("nav", jumpto);
  }
});
