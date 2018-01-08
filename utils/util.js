const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// // 跳转
// const jump=function(pattern, jump) {
//   if (pattern == 'switch') {
//     wx.switchTab({
//       url: jump,
//     })
//   } else if (pattern == 'back') {
//     wx.navigateBack({
//       delta: 1
//     })
//   } else if (pattern == 'redirect') {
//     wx.redirectTo({
//       url: jump,
//     })
//   } else if (pattern == 'rel'){
//     wx.reLaunch({
//       url: jump,
//     })
//   }else {
//     wx.navigateTo({
//       url: jump,
//     })
//   }
// }

module.exports = {
  formatTime: formatTime,
  // jump: jump
}
