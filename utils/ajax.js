const ajax = function (url, method = "GET", data = {}, header) {
  // 测试ip
  let baseUrl = "http://192.168.1.146";

  // let baseUrl = "http://192.168.1.92:8082";

  // 正式ip
  // let baseUrl = "http://111.231.215.169:8081";

  // 正式域名
  // let baseUrl = "http://m.kongfuy.cn";
  return new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl + url,
      data: data,
      method: method,
      header: header,
      success: resolve,
      fail: reject
    })
  });
};

module.exports.ajax = ajax;