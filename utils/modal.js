var modal = function (title, content, showCancel=false, success = function () {}, fail=function(){},confirmText="确定"){
    wx.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        confirmText: confirmText,
        confirmColor : "#fdaf31",
        success: success,
        fail: fail
    })
}


module.exports={
    modal:modal,
}