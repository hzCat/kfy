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
        this.cardChange();
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
    isVip: false
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
      cardType:this.data.option
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
      if (end <= -125 && num >= 0 && num < length - 1) {
        num++;
        this.setData({
          move: nowmove * num,
          num: num
        });
      } else if (end >= 125 && num > 0) {
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
        cardType:this.data.option
      });
    },
    // 已开通
    getOpenIndex(arr) {
      let length = arr.length;
      for (let i = 0; i < length; i++) {
        let obj = arr[i];
        if (obj.opened == true) {
          return i;
        }
      }
    },
    // 是否申请中
    isApply(arr) {
      let length = arr.length;
      for (let i = 0; i < length; i++) {
        let obj = arr[i];
        if (obj.hasApplyOrder == true) {
          return i;
        }
      }
    },
    isRecharge(arr) {
      let length = arr.length;
      for (let i = 0; i < length; i++) {
        let obj = arr[i];
        if (obj.hasRechargeOrder == true) {
          return true;
        }
      }
    },
    // 换卡
    cardChange() {
      console.log("cardChange");
      let that = this;
      let index = that.getOpenIndex(that.data.cardList);
      console.log("卡片长度", that.data.cardList.length, index);
      let nowmove = -(620 / 750) * 100;
      // 是否有申请
      let apply = null;
      let recharge = null;
      if (that.data.option == "group") {
        apply = that.isApply(that.data.cardList);
        recharge = that.isRecharge(that.data.cardList);
        console.log("是否有团卡申请", apply);
        console.log("是否有团卡充值申请", recharge);
        if (apply) {
          that.setData({
            apply: apply
          });
        }
        if (recharge) {
          that.setData({
            recharge: recharge
          });
        }
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
        cardType:this.data.option
      });
    },
    // 跳转
    jump(e) {
      let jumpto = e.currentTarget.dataset.jump;
      jump.jump("nav", jumpto);
    }
  }
});
