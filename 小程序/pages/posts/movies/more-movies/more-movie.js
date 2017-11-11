// pages/posts/movies/more-movies/more-movie.js
var app = getApp();
var util = require("../../../../utils/util");
Page({
  data: {
    movies: [],
    navigationTitle: "",
    isEmpty: true,
    totalCount: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var category = options.category;
    console.log(category);
    this.data.navigationTitle = category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters"
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon"
        break;
      case "豆瓣TOP250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250"
        break;
    };
    this.data.resquestUrl = dataUrl;
    util.http(dataUrl, this.processSetMovieData);
  },//下拉刷新
  onReachBottom: function (event) {
    var requestUrl = this.data.resquestUrl;
    var totalCount = this.data.totalCount;
    var nextUrl = requestUrl + "?start=" + totalCount + "&count=20";
    util.http(nextUrl, this.processSetMovieData);
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh: function () {
    //上拉加载
    var requestUrl = this.data.resquestUrl;
    var refreshUrl = requestUrl + "?start=0&count=20";
    this.data.movies = [];
    this.data.isEmpty = true;
    this.data.totalCount=0;
    util.http(refreshUrl, this.processSetMovieData);
    wx.showNavigationBarLoading();
  },
  processSetMovieData(movieData) {
    var movies = [];
    for (var inx in movieData.subjects) {
      var subject = movieData.subjects[inx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.currentStarsCounts(subject.rating.stars),
        title: title,
        coverImgUrl: subject.images.large,
        average: subject.rating.average,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
      console.log(this.data.movies)
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
  },
  onReady: function () {
    // 页面渲染完成
    var self = this;
    wx.setNavigationBarTitle({
      title: self.data.navigationTitle
    })
  },
    onMovieTap:function(event){
    var movieId=event.currentTarget.dataset.movieid;
     wx.navigateTo({
      url: '/pages/posts/movies/movie-detail/movie-detail?id=' + movieId
    })
  }
})