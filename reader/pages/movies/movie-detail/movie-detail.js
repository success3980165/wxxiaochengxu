var util = require("../../../utils/util.js");
var app = getApp();
Page({
  data: {
    movie: {}
  },
  onLoad: function(options) {
    var movieId = options.id;
    var url = app.globalData.doubanBase +
      "/v2/movie/subject/" + movieId;
    util.http(url, this.processDoubanData);
  },
  //回调函数
  processDoubanData: function(data) {
    if (!data) {
      return;
    }
    console.log(data) //学会看数据  重点处理数据为空值  豆瓣数据处理 视频9-6

  }
})