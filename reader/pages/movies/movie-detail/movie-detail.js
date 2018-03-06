import {
  Movie
} from 'class/Movie.js';
var app = getApp();
Page({
  data: {
    movie: {}
  }, //es6,module,class,promise =>
  onLoad: function(options) {
    var movieId = options.id;
    var url = app.globalData.doubanBase +
      "/v2/movie/subject/" + movieId;
    // util.http(url, this.processDoubanData);
    var movie = new Movie(url);

    movie.getMovieData((movie) => {
      this.setData({
        movie: movie
      })
    })
  },

  viewMoviePostImg: function(e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
})