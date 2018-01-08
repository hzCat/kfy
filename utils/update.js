// 更新用户信息
let storage = require("./storage.js");
let http = require("./ajax.js");

const updateuser = function (header) {
  let url = "/vip/getCurrentVipUser";
  let data = {};
  let method = "GET";
  if (arguments.length == 1) {
    http.ajax(url, method, data, header)
      .then(function (res) {
        console.log("获取所有用户信息",res);
        storage.sets("allInfo", res.data.data)
      })
  } else {
    storage.gets("3rd_session")
      .then(function (res) {
        let head = {
          "_yzsaas_token": res.data,
          'content-type': 'application/x-www-form-urlencoded'
        };
        http.ajax(url, method, data, head)
          .then(function (res) {
            storage.sets("allInfo", res.data.data)
          });
      });
  }
}

module.exports = {
  updateuser: updateuser
}