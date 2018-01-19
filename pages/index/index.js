let jump = require("../../utils/jump.js");
let storage = require("../../utils/storage.js");
let scan = require("../../utils/scanQR.js");
let card = require("../../utils/cardTurn.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalOn: false,
    isVip: [],
    showLoad: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
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
          this.getAllInfo();
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
    this.setData({
      modalOn: true
    });
    if (vipScope == "VIP") {
      if (this.data.isVip[0]) {
        jump.jump("nav", `/pages/QR/QR?vipScope=${vipScope}`);
      } else {
        jump.jump("rel", "/pages/vip/vip?type=personal");
      }
    }else if(vipScope == "TVIP"){
      if (this.data.isVip[1]) {
        jump.jump("nav", `/pages/QR/QR?vipScope=${vipScope}`);
      } else {
        jump.jump("rel", "/pages/vip/vip?type=group");
      }
    }
  },
  // 打开二维码扫描
  openScan() {
    let that = this;
    that.setData({
      modalOn: true
    });
    let close = function() {
      console.log("shade关闭");
      that.setData({
        modalOn: false
      });
    };
    scan.default(close, close);
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
