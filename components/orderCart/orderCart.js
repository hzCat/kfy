// components/orderCart/orderCart.js
let modal = require("../../utils/modal");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      observer(newVal, oldVal) {
        this.calcCount(newVal);
        if (newVal.length > 0 && newVal.length <= 5) {
          this.setData({
            listLength: newVal.length
          });
        } else if (newVal.length > 5) {
          this.setData({
            listLength: 5
          });
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showcart: false,
    listLength: 0,
    dishesCount: 0,
    price: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showcart() {
      if (this.data.list.length > 0) {
        let open = !this.data.showcart;
        this.setData({
          showcart: open
        });
      }
    },
    // 购物车增加
    cartAdd(e) {
      let nowList = this.data.list;
      let idx = e.currentTarget.dataset.idx;
      console.log(nowList);
      console.log("当前下标", e.currentTarget.dataset.idx);
      let one = nowList[idx];
      let nowCount = one.count + 1;
      if (nowCount > 999) {
        nowCount = 999;
      }
      one.count = nowCount;
      nowList[idx] = one;
      this.setData({
        list: nowList
      });
      this.calcCount(nowList);
      this.triggerEvent("sendList", nowList);
    },
    // 购物车删除
    cartCut(e) {
      let nowList = this.data.list;
      let idx = e.currentTarget.dataset.idx;
      console.log(nowList);
      console.log("当前下标", e.currentTarget.dataset.idx);
      let one = nowList[idx];
      let nowCount = one.count - 1;
      if (nowCount == 0) {
        nowList.splice(idx, 1);
      } else {
        one.count = nowCount;
        nowList[idx] = one;
      }
      this.setData({
        list: nowList,
        listLength: nowList.length
      });
      if (nowList.length == 0) {
        this.setData({
          showcart: false
        });
      }
      this.calcCount(nowList);
      this.triggerEvent("sendList", nowList);
    },
    // 清空购物车
    clearCart() {
      this.setData(
        {
          list: [],
          showcart: false
        },
        () => {
          let nowList = this.data.list;
          this.calcCount(nowList);
          this.triggerEvent("sendList", nowList);
        }
      );
    },
    //计算数量金额
    calcCount(list) {
      let count = null;
      let price = null;
      for (let i = 0; i < list.length; i++) {
        let one = list[i];
        count += one.count;
        let one_price = one.detailList.salePrice;
        price += one_price * one.count;
      }
      this.setData({
        dishesCount: count,
        price: price
      });
    },
    cartSubmit() {
      let list = this.data.list;
      if (list.length > 0) {
        console.log(1);

        this.triggerEvent("cartSubmit", list);
      } else {
        modal.modal("提示", "请添加菜品");
      }
    }
  }
});
