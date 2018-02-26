var util = require('../../utils/util.js')
var app = getApp();
Page({
	data: {
		inTheaters: {},
		comingSoon: {},
		top250: {}
	},
	onLoad: function(event) {
		var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + "?start=0&count=3"; //取所有数据的前三条数据
		var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + "?start=0&count=3";
		var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + "?start=0&count=3";
		this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映") //正在热映从这里传到getMovieListData之后从processDoubanData的success传到processDoubanData
		this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映")
		this.getMovieListData(top250Url, "top250", "豆瓣Top250")
	},

	onMoreTap: function(event) {
		var category = event.currentTarget.dataset.category
		wx.navigateTo({ //点击更多跳转到更多电影页面
			url: 'more-movie/more-movie?category=' + category //这里就是得到不同电影类型的方法  重点
		})
	},
	getMovieListData: function(url, settedKey, categoryTitle) { //访问api的公共方法
		var that = this;
		wx.request({
			url: url,
			method: 'GET',
			header: { //必须要是设置header
				"Content-Type": "json"
			},
			success: function(res) {
				console.log(res)
				that.processDoubanData(res.data, settedKey, categoryTitle)
			},
			fail: function(error) {
				console.log(error)
			},
		})
	},
	processDoubanData: function(moviesDouban, settedKey, categoryTitle) { //参数moviesDouban  就是从豆瓣api中取回来的数据  settedKey是区分到底是inTheaters，comingSoon还是top250Url  categoryTitle是取正在热映，即将上映，top250的参数
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
		var readyData = {};
		readyData[settedKey] = { //把对象readyData的属性去动态的赋值
			movies: movies,
			categoryTitle: categoryTitle
		}
		this.setData(readyData); //数据绑定
	}
})