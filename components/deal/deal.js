// components/deal/deal.js
let http = require("../../utils/ajax.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkbox(e) {
      // console.log(e.detail.value[0]);
      let check = e.detail.value[0];
      let checked = null;
      if (check) {
        checked = true;
      } else {
        checked = false;
      }
      console.log(checked);
      this.triggerEvent("checkValue", { isCheck: checked });
    },
    // 获取协议文档
    getDoc() {
      let downloadUrl =
        "http://192.168.1.146:11811/group1/M00/00/01/wKgBkloeYFyAdaptAABP-yHX5mA65_big.docx";
      // 下载
      wx.downloadFile({
        url: downloadUrl,
        success: function(res) {
          let tempfilePath = res.tempFilePath;
          // 打开
          wx.openDocument({
            filePath: tempfilePath,
            success: function(res) {},
            fail(err) {}
          });
        },
        fail(err) {}
      });
    }
  }
});
