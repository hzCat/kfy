// 两位小数，wxml显示不出小数点后为零的小数，转字符串显示
var tostr = function (num, n = 2) {
  var num1 = "" + num;
  var a = num1.indexOf(".");
  var num2 = num1.substring(0, a + 3);
  return num2;
}

// 修改时间长度
var cuttime = function (time, start = 5, length = 11) {
  var time2 = time.substr(start, length)
  return time2
}


module.exports = {
  tostr: tostr,
  cuttime: cuttime
}