// components/couponChoose/couponChoose.js
let app = getApp();
let http = require("../../utils/ajax");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer() {}
    },
    type: {
      type: String,
      value: "check" //notcheck_icon    notcheck  check
    },
    namecolor: {
      type: String,
      value: "#e4393c"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    page: 1,
    isUse: false
  },

  /**
   * 组件的方法列表
   */
  attached() {
    this.getCoupon();
  },
  methods: {
    showAllCoupon() {
      this.setData({
        show: true
      });
    },
    chooseCoupon(e) {
      console.log(e.currentTarget.dataset.id);
      this.setData({
        show: false
      });
    },
    isUse() {
      let check = !this.data.isUse;
      this.setData({
        isUse: check
      });
    },
    getCoupon() {
      let p = this.data.page;
      http
        .ajax(
          "/vipCoupon/findCouponForSelect",
          "GET",
          { page: p, rows: 10, scene: "USABLE" },
          app.globalData.header
        )
        .then(res => {
          console.log(res.data.data);
        });
    }
  }
});
