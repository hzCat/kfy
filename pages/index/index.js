let jump = require("../../utils/jump.js");
let storage = require("../../utils/storage.js");
let scan = require("../../utils/scanQR.js");
let card = require("../../utils/cardTurn.js");
let modal = require("../../utils/modal");
let http = require("../../utils/ajax");
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalOn: false,
    isVip: [],
    showLoad: false,
    reqTimer: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("进入参数", options);
    if (options.scanAgain) {
      console.log("onload options", options.scanAgain);
      setTimeout(() => {
        this.openScan();
      }, 500);
    }
    if (options.actid && options.invite) {
      let invite = options.invite;
      let actid = options.actid;
      let n = 0;
      let timer = setInterval(() => {
        console.log(`第${n}次`);
        n++;
        if (app.globalData.header) {
          clearInterval(timer);
          timer = null;
          http
            .ajax(
              "/activityInvite/isValid",
              "GET",
              { activityId: actid },
              app.globalData.header
            )
            .then(res => {
              console.log("活动是否有效", res.data);
              if (res.data.data) {
                jump.jump(
                  "rel",
                  `/pages/vip/vip?invite=${invite}&actid=${actid}`
                );
              } else {
                jump.jump("nav", "");
              }
            });
        } else if (n == 10) {
          clearInterval(timer);
          timer = null;
        }
      }, 500);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    this.setData({
      modalOn: false
    });
    this.getAllInfo();
  },
  //获取用户信息缓存
  getAllInfo() {
    let that = this;
    storage
      .gets("allInfo")
      .then(res => {
        console.log("index获取到了allInfo", res.data);
        let arr = card.getvip(res.data.vipCardList);
        console.log("是不是VIP", arr);
        that.setData({
          isVip: arr,
          showLoad: false
        });
        wx.hideLoading();
      })
      .catch(err => {
        console.log("index未获取到allInfo", err);
        if (!that.data.showLoad) {
          wx.showLoading({
            title: "登录中",
            mask: true,
            success() {
              that.setData({
                showLoad: true
              });
            }
          });
        }
        setTimeout(() => {
          if (that.data.reqTimer < 30) {
            let now = that.data.reqTimer;
            this.getAllInfo();
            this.setData({
              reqTimer: now + 1
            });
          } else {
            wx.hideLoading();
            modal.modal("提示", "登录失败,请稍后重试");
          }
        }, 500);
      });
  },
  // 查找是否vip或者tvip
  // isVip(allInfo) {
  //   let all = allInfo;
  //   let cardList = all.vipCardList;
  //   let length = cardList.length;
  //   let isVip = false;
  //   let isTvip = false;
  //   for (let i = 0; i < length; i++) {
  //     let obj = cardList[i];
  //     if (obj.vipScope == "VIP") {
  //       isVip = true;
  //     }
  //     if (obj.vipScope == "TVIP") {
  //       isTvip = true;
  //     }
  //   }
  //   console.log("个人会员", isVip);
  //   console.log("团餐会员", isTvip);
  //   this.setData({
  //     isVip: isVip,
  //     isTvip: isTvip
  //   });
  // },
  // 跳转扫码页面,带VIP类型
  toQR(e) {
    console.log("点击的类型", e.currentTarget.dataset.scope);
    let vipScope = e.currentTarget.dataset.scope;
    this.setData(
      {
        modalOn: true
      },
      () => {
        if (vipScope == "VIP") {
          if (this.data.isVip[0]) {
            jump.jump("nav", `/pages/QR/QR?vipScope=${vipScope}`);
          } else {
            jump.jump("rel", "/pages/vip/vip?type=personal");
          }
        } else if (vipScope == "TVIP") {
          if (this.data.isVip[1]) {
            jump.jump("nav", `/pages/QR/QR?vipScope=${vipScope}`);
          } else {
            jump.jump("rel", "/pages/vip/vip?type=group");
          }
        }
      }
    );
  },
  // 打开二维码扫描
  openScan() {
    let that = this;
    // let close = function() {
    //   console.log("shade关闭");
    //   that.setData({
    //     modalOn: false
    //   });
    // };
    that.setData(
      {
        modalOn: true
      },
      () => {
        scan.default();
      }
    );

    // wx.scanCode({
    //   onlyFromCamera: true,
    //   success: res => {
    //     that.setData({
    //       modalOn: false
    //     });
    //     try {
    //       var plateNo = res.result;
    //       wx.navigateTo({
    //         url: "/pages/waitPay/waitPay?by=scan&plateNo=" + plateNo
    //       });
    //     } catch (e) {
    //       modal.modal("提示", "错误的二维码");
    //     }
    //   },
    //   fail() {
    //     that.setData({
    //       modalOn: false
    //     });
    //   }
    // });
  }
});
