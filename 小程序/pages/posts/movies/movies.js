// pages/posts/movies/movies.js
var app = getApp();
var util = require("../../../utils/util");
Page({
  data: {
    inTheater: {},
    comingSoon: {},
    top250: {},
    searchData: {},
    containerShow: true,
    searchPanelShow: false,
    searchCount: 0
  },
  //通过RESTful api从服务器请求数据
  onLoad: function (event) {
    var inTheaterUrl = app.globalData.doubanBase + "/v2/movie/in_theaters?start=0&count=3",
      comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon?start=0&count=3",
      top250Url = app.globalData.doubanBase + "/v2/movie/top250?start=0&count=3";
    util.http(inTheaterUrl, this.processSetMovieData, "inTheater", "正在热映");
    util.http(comingSoonUrl, this.processSetMovieData, "comingSoon", "即将上映");
    util.http(top250Url, this.processSetMovieData, "top250", "豆瓣TOP250");
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '/pages/posts/movies/movie-detail/movie-detail?id=' + movieId
    })
  }
  ,
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: '/pages/posts/movies/more-movies/more-movie?category=' + category
    })
  },
  onBindFocus: function () {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    });
  },
  onCloseTap: function () {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchData: {}
    });
  },
  onBindConfirm: function (e) {
    var text = e.detail.value;//获取表单输入值
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    util.http(searchUrl, this.processSetMovieData, "searchData", "");
    this.setData({
      searchUrl: searchUrl
    });
  },
  processSetMovieData(movieData, key, urlTitle) {
    var movies = [];
    var self = this;
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
    var readData = {};//存储特定url的内容
    readData[key] = {
      urlTitle: urlTitle,
      movies: movies
    };
    this.setData(readData);
    if (key === "searchData") {
     /* self.setData({
        searchData: movies
      });
      console.log(self.data.searchData);*/
      self.data.searchCount += 20;
      wx.hideNavigationBarLoading();
      /* var newSearchData = self.data.searchData.movies.concat(movies);
       console.log(newSearchData);
       self.setData({
          searchData: newSearchData
        });*/
    }
  },
  onReachBottom: function (event) {
    var self = this;
    if (self.data.searchPanelShow) {
      var searchUrl = this.data.searchUrl;
      var searchCount = this.data.searchCount;
      var nextsearchUrl = searchUrl + "&start=" + searchCount + "&count=20";
      util.http(nextsearchUrl, this.processSetMovieData, "searchData", "");
      wx.showNavigationBarLoading();
    }
  },

  /*扫描
  scanQRCode: function () {
    wx.scanCode({
      success: function (result) {
        wx.showModal({ content: JSON.stringify(result) })
      },
      fail: function (error) {
        wx.showModal({ content: JSON.stringify(error) })
      }
    })
  },*/
})