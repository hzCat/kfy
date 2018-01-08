var color = function (fcolor, bcolor) {
    wx.setNavigationBarColor({
        frontColor: fcolor,
        backgroundColor: bcolor,
        animation: {
            duration: 400,
            timingFunc: 'linear'
        }
    })
};

var title = function (title) {
    wx.setNavigationBarTitle({
        title: title,
    })
};

module.exports = {
    color: color,
    title: title,
}