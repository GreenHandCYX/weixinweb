// pages/posts/movies/movie-detail/movie-detail.js
import {Movie} from 'class/Movie';
var app = getApp();
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var movieId = options.id;
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
   var movie=new Movie(url);
   movie. getMovieData((movie)=>{
     this.setData({
       movie:movie
     });
   });
  },
 
  onPreviewTap:function(event){
    var src=event.currentTarget.dataset.src;
    wx.previewImage({
      // 预览图片, 
      current:src,// 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src]
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})