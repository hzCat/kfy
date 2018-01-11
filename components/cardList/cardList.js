// components/cardList/cardList.js
let app = getApp();
let http = require("../../utils/ajax.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    vipCardList: {
      type: Array,
      value: [],
      observer() {}
    },
    tvipCardList: {
      type: Array,
      value: [],
      observer() {}
    },
    vipWidth: {
      type: String,
      value: "750"
    },
    tvipWidth: {
      type: String,
      value: "750"
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
    num: 0,
    cardIndex: 0
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
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tstart(e) {
      let start = e.changedTouches[0].clientX;
      let move = this.data.move;
      console.log(start, move);
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
      if (move % 5 == 0) {
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
      let length = this.data.vipCardList.length;
      let nowmove = -(620 / 750) * 100;
      if (end <= -150 && num >= 0 && num < length - 1) {
        num++;
        this.setData({
          move: nowmove * num,
          num: num
        });
      } else if (end >= 150 && num > 0) {
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
      this.triggerEvent("indexChange", { index: this.data.num });
    }
  }
});
