// components/couponCard/couponCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 列表
    couponList: {
      type: Array
    },
    // 有效时间
    time: {
      type: String
    },
    // 支付金额
    // 判断是否显示
    payAmt: {
      type: Number
    },
    // 可以使用金额
    canUse: {
      type: Number
    },
    // 优惠金额
    offerMoney: {
      type: Number
    },
    // 券名称
    couponName: {
      type: String
    },
    // 券状态
    couponState: {
      type: String,
      value: "useable"
    },
    canClick: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {}
});
