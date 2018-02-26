var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
    	post_key:postsData.postList
    });
  },
  onPostTap:function(event) {
    var postId = event.currentTarget.dataset.postid  //获取postId   事件对象 当前鼠标点击的组件（view） 所有自定义属性集合 下的postId
    wx.navigateTo({
      url:'post-detail/post-detail?id=' + postId
    })
  },
  onSwiperTap:function(event) {
    //target 和 currentTarget   target指的是当前点击的组件  currentTarget指的是事件捕获的组件
    //target指的是image 而currentta指的是swiper 因为image上有postid所以点击当前图片用target 而在swiper上没有postid所以实在swiper实行事件捕获，所以用currentTarget
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url:'post-detail/post-detail?id=' + postId
    })
  }
})