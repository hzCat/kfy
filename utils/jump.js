// 跳转
const jump = function(pattern, jump) {
  if (pattern == "switch") {
    wx.switchTab({
      url: jump
    });
  } else if (pattern == "back") {
    wx.navigateBack({
      delta: 1
    });
  } else if (pattern == "redirect") {
    wx.redirectTo({
      url: jump
    });
  } else if (pattern == "rel") {
    wx.reLaunch({
      url: jump
    });
  } else {
    wx.navigateTo({
      url: jump
    });
  }
};
module.exports = {
  jump: jump
};
