Page({
  data: {
    navigateTitle: ''
  },
  onLoad: function(options) {
    var category = options.category; //这里就获取到movies.js中的category
    this.data.navigateTitle = category
    console.log(category)
  },
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success: function(res) {

      }
    })
  }
})