// components/cardList/cardList.js
let app = getApp();
let http = require("../../utils/ajax.js");
let jump = require("../../utils/jump.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cardList: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        console.log("有变化值", this.data.option, newVal);
        // this.isApply(newVal);
        // this.isRecharge(newVal);
        // this.getOpenIndex(newVal);
        this.cardChange(newVal);
      }
    },
    vipWidth: {
      type: String,
      value: "750"
    },
    num: {
      type: Number,
      value: 0
    },
    option: {
      type: String,
      value: ""
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    start: null,
    move: 0,
    thismove: 0,
    end: null,
    screenWidth: 375,
    cardIndex: 0,
    openIndex: null,
    apply: null,
    recharge: null,
    isVip: false,
    modalOn: false
  },
  attached() {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowWidth);
        that.setData({
          screenWidth: res.windowWidth
        });
      }
    });
    this.triggerEvent("indexChange", {
      index: this.data.num,
      cardType: this.data.option
    });
    // let index = that.getOpenIndex(that.data.cardList);
    // console.log("卡片长度",that.data.cardList.length, index);
    // let nowmove = -(620 / 750) * 100;
    // // 是否有申请
    // let apply = null;
    // let recharge = null;
    // if (that.data.option == "group") {
    //   apply = that.isApply(that.data.cardList);
    //   recharge = that.isRecharge(that.data.cardList);
    //   console.log("是否有团卡申请", apply);
    //   if (apply) {
    //     that.setData({
    //       apply: apply
    //     });
    //   }
    //   if (recharge) {
    //     that.setData({
    //       recharge: recharge
    //     });
    //   }
    // }

    // if (index) {
    //   that.setData({
    //     move: nowmove * index,
    //     openIndex: index,
    //     num: index
    //   });
    // }
    // this.triggerEvent("indexChange", { index: this.data.num });
  },
  // ready(){
  //   this.triggerEvent("indexChange", {
  //     index: this.data.num,
  //   });
  // },
  /**
   * 组件的方法列表
   */
  methods: {
    tstart(e) {
      let start = e.changedTouches[0].clientX;
      let move = this.data.move;
      this.setData({
        start: start,
        thismove: move
      });
    },
    tmove(e) {
      let start = this.data.start;
      let thismove = this.data.thismove;
      let now = e.changedTouches[0].clientX;
      let nowmove = now - start;
      let move = parseInt(nowmove / this.data.screenWidth * 100);
      if (move % 2 == 0) {
        this.setData({
          move: move + thismove
        });
      }
    },
    tend(e) {
      let now = e.changedTouches[0].clientX;
      let start = this.data.start;
      let end = now - start;
      let num = this.data.num;
      let length = this.data.cardList.length;
      let nowmove = -(620 / 750) * 100;
      if (end <= -100 && num >= 0 && num < length - 1) {
        num++;
        this.setData({
          move: nowmove * num,
          num: num
        });
      } else if (end >= 100 && num > 0) {
        num--;
        this.setData({
          move: nowmove * num,
          num: num
        });
      } else {
        this.setData({
          move: nowmove * num
        });
      }
      this.triggerEvent("indexChange", {
        index: this.data.num,
        cardType: this.data.option
      });
    },
    // 已开通
    getOpenIndex(arr) {
      let length = arr.length;
      for (let i = 0; i < length; i++) {
        let obj = arr[i];
        if (obj.opened == true) {
          this.setData(
            {
              openIndex: i,
              isVip: true
            },
            () => {
              console.log("是否已开通", this.data.openIndex, this.data.isVip);
            }
          );
          return i;
        }
      }
    },
    // 是否申请中
    isApply(arr) {
      console.log("是否申请中");
      let length = arr.length;
      for (let i = 0; i < length; i++) {
        let obj = arr[i];
        if (obj.applyStatus == "WAIT_DEAL") {
          this.setData({
            apply: true
          });
          break;
        } else {
          this.setData({
            apply: false
          });
        }
      }
      // let url = "/tvip/getApplyOrderInfo";
      // http.ajax(url, "GET", {}, app.globalData.header).then(res => {
      //   console.log(res.data);
      //   if (res.data.data) {
      //     if (res.data.data.applyStatus == "WAIT_DEAL") {
      //       console.log("true");
      //       this.setData({
      //         apply:true
      //       })
      //     }
      //   }
      // });
    },
    isRecharge(arr) {
      let that = this;
      let length = arr.length;
      for (let i = 0; i < length; i++) {
        let obj = arr[i];
        // console.log(obj.hasRechargeOrder);
        if (obj.hasRechargeOrder) {
          that.setData({
            recharge: true
          });
          break;
        } else {
          that.setData({
            recharge: false
          });
        }
      }
      console.log("是否充值中");
    },
    // 换卡
    cardChange(arr) {
      console.log("cardChange");
      let that = this;
      let index = that.getOpenIndex(arr);
      console.log("卡片长度", arr.length, index);
      let nowmove = -(620 / 750) * 100;
      // 是否有申请
      let apply = null;
      let recharge = null;
      if (that.data.option == "group") {
        that.isApply(arr);
        that.isRecharge(arr);
        console.log("是否有团卡申请", that.data.apply);
        console.log("是否有团卡充值申请", that.data.recharge);
        // if (apply) {
        //   that.setData({
        //     apply: apply
        //   });
        // }
        // if (recharge) {
        //   that.setData({
        //     recharge: recharge
        //   });
        // }
      }
      if (index) {
        that.setData({
          move: nowmove * index,
          openIndex: index,
          num: index,
          isVip: true
        });
      }
      this.triggerEvent("indexChange", {
        index: this.data.num,
        cardType: this.data.option
      });
    },
    // 跳转
    jump(e) {
      let jumpto = e.currentTarget.dataset.jump;

      this.setData(
        {
          modalOn: true
        },
        () => {
          jump.jump("nav", jumpto);
        }
      );
    }
  }
});
