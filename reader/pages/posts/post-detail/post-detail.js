var postsData = require('../../../data/posts-data.js')
var app = getApp() // 引入全局的文件app.js
Page({
	data: {
		isPlayingMusic: false
	},
	onLoad: function(option) {
		var postId = option.id; //获取post.js中的postId
		var postData = postsData.postList[postId];
		this.data.currentPostId = postId; //定义一个变量可以使id传递onColletionTap去
		this.setData({
			postData: postData
		})
		// this.data.postData = postData;

		// var postsCollect = {

		// }

		var postsCollect = wx.getStorageSync('postsCollected') //读取所有文章的缓存状态
		if (postsCollected) {
			var postCollected = postsCollected[postId]
			this.setData({
				collected: postCollected
			})
		} else {
			var postsCollected = {}
			postsCollected[postId] = false;
			wx.setStorageSync("posts_collected", postsCollected)
		}
		if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
			this.setData({
				isPlayingMusic: true
			})
		}
		this.setMusicMonitor();
	},
	setMusicMonitor: function() {
		//监听音乐 总框架图标跟随图片一起改变
		var that = this
		wx.onBackgroundAudioPlay(function() {
			that.setData({
				isPlayingMusic: true
			})
			app.globalData.g_isPlayingMusic = true
			app.globalData.g_currentMusicPostId = that.data.currentPostId
		})
		wx.onBackgroundAudioPause(function() {
			that.setData({
				isPlayingMusic: false
			})
			app.globalData.g_isPlayingMusic = false
			app.globalData.g_currentMusicPostId = null
		})
		wx.onBackgroundAudioStop(function() { //音乐停止后图片回复
			that.setData({
				isPlayingMusic: false
			})
			app.globalData.g_isPlayingMusic = false
			app.globalData.g_currentMusicPostId = null
		})
	},
	onColletionTap: function(event) {
		this.getPostsCollectedSyc();
		// this.getPostsCollectedAsy();
	},
	//异步方法
	getPostsCollectedAsy: function() {
		var that = this
		wx.getStorage({
			key: 'posts_collected',
			success: function(res) {
				var postsCollected = res.data;
				var postCollected = postsCollected[that.data.currentPostId] //获取当前文章的id
				//收藏变成为收藏，为收藏变成收藏
				postCollected = !postCollected;
				postsCollected[that.data.currentPostId] = postCollected;
				that.showToast(postsCollected, postCollected);
			}
		})
	},
	//同步方法
	getPostsCollectedSyc: function() {
		var postsCollected = wx.getStorageSync('posts_collected');
		var postCollected = postsCollected[this.data.currentPostId] //获取当前文章的id
		//收藏变成为收藏，为收藏变成收藏
		postCollected = !postCollected;
		postsCollected[this.data.currentPostId] = postCollected;
		this.showToast(postsCollected, postCollected);
	},
	showModal: function(postsCollected, postCollected) {
		//模态弹窗
		var that = this
		wx.showModal({
			title: "收藏",
			content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
			showCancel: "true",
			cancelText: "取消",
			cancelColor: "#333",
			confirmText: "确认",
			confirmColor: "#405f80",
			success: function(res) {
				if (res.confirm) {
					//更新文章的是否缓存值
					wx.setStorageSync('posts_collected', postsCollected);
					//更新数据绑定变量，从而实现图片切换
					that.setData({
						collected: postCollected
					})
				}
			}
		})
	},
	showToast: function(postsCollected, postCollected) {
		//更新文章的是否缓存值
		wx.setStorageSync('posts_collected', postsCollected);
		//更新数据绑定变量，从而实现图片切换
		this.setData({
			collected: postCollected
		})
		//收藏图片提示Api
		wx.showToast({
			title: postCollected ? "收藏成功" : "取消收藏",
			duration: 1000,
			icon: "success"
		})
	},
	//事件处理函数都加参数event
	onShareTap: function(event) {
		var itemList = [
			"分享给微信好友",
			"分享到朋友圈",
			"分享到QQ",
			"分享到微博"
		];
		wx.showActionSheet({
			itemList: itemList,
			itemColor: "#405f80",
			success: function(res) {
				// res.cancel 用户是否点击了取消
				// res.tapIndex 数组序号，从0开始
				wx.showModal({
					title: "用户 " + itemList[res.tapIndex],
					content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
				})
			}
		})
	},
	//点击播放音乐功能
	onMusicTap: function(event) {
		var currentPostId = this.data.currentPostId;
		var postData = postsData.postList[currentPostId]
		var isPlayingMusic = this.data.isPlayingMusic
		if (isPlayingMusic) {
			//暂停音乐
			wx.pauseBackgroundAudio();
			this.setData({
				isPlayingMusic: false
			})
		} else {
			//播放音乐 获取音乐的地址，头信息
			wx.playBackgroundAudio({
				dataUrl: postData.music.url,
				title: postData.music.title,
				coverImgUrl: postData.music.coverImg
			})
			this.setData({
				isPlayingMusic: true
			})
		}

	}
})