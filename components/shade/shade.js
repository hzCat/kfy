// components/shade/shade.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalOn: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        let that = this;
        console.log("遮罩打开", newVal);
        if (newVal == true) {
          that.close();
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      setTimeout(() => {
        this.setData({
          modalOn: false
        });
      }, 1000);
    }
  }
});
