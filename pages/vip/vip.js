let app = getApp();
let http = require("../../utils/ajax.js");
let storage = require("../../utils/storage.js");
let card = require("../../utils/cardTurn.js");
let jump = require("../../utils/jump.js");
let modal = require("../../utils/modal");
let update = require("../../utils/update");
let turn = require("../../utils/turnto");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    vipCardList: [],
    tvipCardList: [],
    vipWidth: "750",
    tvipWidth: "750",
    cardType: "personal",
    nowCard: [],
    allInfo: {},
    list: [],
    isVip: [],
    vipLevel: null,
    tvipLevel: null,
    nowIndex: null,
    applyFail: false,
    bindMobile: false,
    getPhoneNumber: false,
    bindTo: "",
    modalOn: false,
    waitDeal: false,
    rechargeDeal: false,
    rechargeFail: false,
    isvip: false,
    istvip: false,
    p_total: null,
    t_total: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.type) {
      let type = options.type;
      this.setData({
        cardType: type
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    storage.gets("allInfo").then(res => {
      console.log("vip加载allInfo", res.data);
      // let arr = card.turn(res.data.vipCardList);
      // let vipArr = card.getvip(res.data.vipCardList);
      let bindPhone = res.data.bindMobile;
      // console.log(arr);
      // console.log(vipArr);
      this.setData({
        allInfo: res.data,
        // list: arr,
        // isVip: vipArr,
        bindMobile: bindPhone
      });
    });
    this.refreshCard();
    this.getVipList();
    this.getTvipList();
    this.setData({
      getPhoneNumber: false
    });
  },
  onReady() {},
  // 获取个人列表
  getVipList() {
    let that = this;
    let data = {
      vipScope: "VIP"
    };
    http
      .ajax("/vip/getVipLevelList", "GET", data, app.globalData.header)
      .then(res => {
        console.log("个人卡列表", res.data.data);
        let isvip = card.getvip2(res.data.data) || false;
        console.log("个人是不是会员", isvip);
        let isVip = that.data.isVip;
        isVip[0] = isvip;
        let level = card.level(res.data.data);
        console.log("个卡开通等级", level);
        let l = res.data.data.length;
        let w = 750 * l - 130 * (l - 1);
        that.setData({
          vipCardList: res.data.data,
          vipWidth: w,
          vipLevel: level,
          isvip: isvip
        });
      })
      .catch(err => {
        let succ = res => {
          if (res.confirm) {
            jump.jump("switch", "/pages/index/index");
          }
        };
        modal.modal("提示", "网络差,请检查", false, succ);
      });
  },
  // 获取团餐列表
  getTvipList() {
    let that = this;
    let data = {
      vipScope: "TVIP"
    };
    http
      .ajax("/vip/getVipLevelList", "GET", data, app.globalData.header)
      .then(res => {
        console.log("团卡列表", res.data.data);
        let istvip = card.getvip2(res.data.data) || false;
        console.log("团餐是不是会员", istvip);
        that.isApply(res.data.data);
        that.isWait(res.data.data);
        that.isChar(res.data.data);
        let level = card.level(res.data.data);
        console.log("团餐开通等级", level);
        let l = res.data.data.length;
        let w = 750 * l - 130 * (l - 1);
        that.setData({
          tvipCardList: res.data.data,
          tvipWidth: w,
          tvipLevel: level,
          istvip: istvip
        });
      })
      .catch(err => {
        let succ = res => {
          if (res.confirm) {
            jump.jump("switch", "/pages/index/index");
          }
        };
        modal.modal("提示", "网络差,请检查", false, succ);
      });
  },
  // 更新余额
  refreshCard() {
    let url = "/vip/getVipCardList";
    http
      .ajax(url, "GET", {}, app.globalData.header)
      .then(res => {
        console.log("刷新卡片信息", res.data.data);
        let cardList = res.data.data;
        let arr = card.turn(cardList);
        console.log("更新后的卡片", arr);
        let p_total = null;
        let t_total = null;
        if (arr[0] && arr[0].cardBalance) {
          p_total = turn.tostr(arr[0].cardBalance);
        }
        console.log(2);
        if (arr[1] && arr[1].cardBalance) {
          t_total = turn.tostr(arr[1].cardBalance);
        }
        console.log(3);
        this.setData({
          list: arr,
          p_total: p_total,
          t_total: t_total
        });
        console.log(4);
      })
      .catch(err => {
        console.log("刷新卡错误", err);
        modal.modal("提示", "会员信息更新失败,请重试");
      });
  },
  // 是否失败中
  isApply(arr) {
    let length = arr.length;
    for (let i = 0; i < length; i++) {
      let obj = arr[i];
      if (obj.applyStatus == "FAIL") {
        console.log("true");
        this.setData({
          applyFail: true
        });
        break;
      } else {
        this.setData({
          applyFail: false
        });
      }
    }
    // let url = "/tvip/getApplyOrderInfo";
    // http.ajax(url, "GET", {}, app.globalData.header).then(res => {
    //   console.log(res.data);
    //   if (res.data.data) {
    //     if (res.data.data.applyStatus == "FAIL") {
    //       console.log("true");
    //       this.setData({
    //         applyFail: true
    //       });
    //     }else{
    //       this.setData({
    //         applyFail: false
    //       });
    //     }
    //   }
    // });
  },
  // 是否等待处理
  isWait(arr) {
    let length = arr.length;
    for (let i = 0; i < length; i++) {
      let obj = arr[i];
      if (obj.applyStatus == "WAIT_DEAL") {
        console.log("true");
        this.setData({
          waitDeal: true
        });
        break;
      } else {
        this.setData({
          waitDeal: false
        });
      }
    }
  },
  // 是否充值
  isChar(arr) {
    let length = arr.length;
    for (let i = 0; i < length; i++) {
      let obj = arr[i];
      if (obj.hasRechargeOrder) {
        if (obj.rechargeOrderStatus == "FAIL") {
          this.setData({
            rechargeDeal: true,
            rechargeFail: true
          });
        } else {
          this.setData({
            rechargeDeal: true
          });
        }
        break;
      } else {
        this.setData({
          rechargeDeal: false
        });
      }
    }
  },
  // 个卡团卡切换
  boxSwitch(e) {
    console.log(this.data.nowCard);
    let type = e.currentTarget.dataset.type;
    if (this.data.cardType != type) {
      console.log(this.data.nowIndex);
      if (type == "personal") {
        this.setData({
          nowIndex: this.data.vipLevel || 0
        });
      } else if (type == "group") {
        this.setData({
          nowIndex: this.data.tvipLevel || 0
        });
      }
      this.setData({
        cardType: type
      });
    }
  },
  // 传出的index变化
  indexChange(e) {
    console.log("传出的数据", e.detail);
    let cardIndex = e.detail.index;
    let type = e.detail.cardType;
    // console.log("nowIndex", cardIndex);
    // console.log("cardType", type);
    this.setData({
      nowIndex: cardIndex
    });
    // this.nowShowCard(cardIndex);
  },

  // 关闭页面时,更新用户信息
  // onHide: function() {
  //   console.log("onHide onHide onHide onHide");
  //   let that = this;
  //   // let isVipArr = this.data.isVip;
  //   // let l = isVipArr.length;
  //   // for (let i = 0; i < l; i++) {
  //   //   let bool = isVipArr[i];
  //   if (this.data.waitDeal || this.data.rechargeDeal) {
  //     console.log("onHide更新allInfo");
  //     update.updateuser(app.globalData.header);
  //   }
  //   // }
  // },

  // 现在显示的卡
  // nowShowCard(index) {
  //   let groupCard = this.data.tvipCardList;
  //   let personalCard = this.data.vipCardList;
  //   let nowCardList = null;
  //   let now = [];
  //   if (this.data.cardType == "group") {
  //     nowCardList = groupCard;
  //   } else if (this.data.cardType == "personal") {
  //     nowCardList = personalCard;
  //   }
  //   now = nowCardList[index];
  //   console.log("现在的卡列表1", this.data.nowCard);
  //   if (now) {
  //     this.setData({
  //       nowCard: now
  //     });
  //     console.log("现在的卡列表2", this.data.nowCard);
  //   }
  // },
  jump(e) {
    this.setData({
      modalOn: true
    });
    let jumpto = e.currentTarget.dataset.jump;
    jump.jump("nav", jumpto);
  },
  closeFail() {
    if (this.data.rechargeFail) {
      this.setData({
        rechargeFail: false
      });
    } else if (this.data.applyFail) {
      this.setData({
        applyFail: false
      });
    }
  },
  // 从微信获取手机号进行绑定
  getPhoneNumber: function(e) {
    var that = this;
    let jumpto = e.currentTarget.dataset.jump;
    that.setData({
      modalOn: true
    });
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.showLoading({
        title: "绑定中"
      });
      var url = "/vipCenter/bindMobileWithWX";
      var method = "POST";
      var data = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      };
      http
        .ajax(url, method, data, app.globalData.header)
        .then(function(res) {
          console.log(res.data);
          var url = "/vip/getCurrentVipUser";
          var data = {};
          var method = "GET";
          // var header = that.data.header;
          http
            .ajax(url, method, data, app.globalData.header)
            .then(function(res) {
              console.log(res);
              wx.setStorage({
                key: "allInfo",
                data: res.data.data,
                success: function(res) {
                  // var pattern = "redirect";
                  // var jump = "/pages/usercenter/usercenter";
                  setTimeout(function() {
                    // util.jump(pattern, jump);
                    // that.getAllInfo();
                    jump.jump("nav", jumpto);
                    wx.hideLoading();
                  }, 1500);
                }
              });
            })
            .catch(function(err) {
              console.log(err);
            });
        })
        .catch(function(err) {
          modal.modal("提示", "手机号绑定失败,请重试");
        });
    } else {
      // ju.jump("nav", "/pages/relatePhone/relatePhone");
      this.setData({
        getPhoneNumber: true,
        bindTo: jumpto
      });
    }
  }
});
