var gets=function(name){
  return new Promise(function(res,rej){
    wx.getStorage({
      key: name,
      success: res,
      fail:rej
    })
  })
}

var sets=function(name,obj){
  wx.setStorage({
    key: name,
    data: obj,
  })
}

module.exports={
  gets:gets,
  sets:sets
}