var app = getApp();
var util = require('../../../utils/util.js')
Page({
  data: {
    navigateTitle: '', //这个可以保存一个新的变量就可以在其他的函数中使用他了
    movies: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true //数据变量是不是空的
  },
  onLoad: function(options) {
    var category = options.category; //这里就获取到movies.js中的category
    this.data.navigateTitle = category;
    console.log(category)
    var dataUrl = '';
    switch (category) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case '豆瓣Top250':
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break
    }
    this.data.requestUrl = dataUrl
    util.http(dataUrl, this.processDoubanData)
  },
  // onScrollLower: function(event) { //上滑动加载更多函数
  //   // console.log("加载更多")
  //   var nextUrl = this.data.requestUrl + //上面的函数dataUrl就是requestUrl需要请求的Url
  //     "?start=" + this.data.totalCount + "&count20"; //totalCount 是一个累加的过程，没下滑就加载一次数据
  //   util.http(nextUrl, this.processDoubanData)
  //   wx.showNavigationBarLoading() //loading
  // },
  onReachBottom: function(event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  onPullDownRefresh: function(event) { //下拉刷新函数
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.totalCount = 0;
    this.data.isEmpty = true; //加载后需要把数据置空，否则会走if(!this.data.isEmpty) 这样就会新的0-19号数据和老的0-19号数据从新结合新的数组，出现重复数据
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  processDoubanData: function(moviesDouban) { //这个事处理数据的函数
    var movies = [];
    for (var idx in moviesDouban.subjects) { //遍历subjects
      var subject = moviesDouban.subjects[idx]
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."; //截取title长度，如果太长大于6位则用省略号表示
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars), //这就是util文件中方法的调用 stars就是[1,1,1,1,1]的形式的数组
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id //跳转到电影详情
      }
      movies.push(temp) //吧temp push到movies中
    }
    var totalMovies = {}

    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies); //把老的数据和新的数据合并到一起  老数据this.data.movies  新数据movies
    } else {
      totalMovies = movies
      this.data.isEmpty = false
    }
    this.setData({
      movies: totalMovies
    }); //数据绑定
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
  },

  onReady: function() {
    wx.setNavigationBarTitle({ //动态设置导航栏标题
      title: this.data.navigateTitle,
      success: function(res) {

      }
    })
  },
  onMovieTap: function(event) { //点击电影调转到电影详情页面
    var movieId = event.currentTarget.dataset.movieid; //拿到movieId  这个事跳转和传movieId的方法在这
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
})