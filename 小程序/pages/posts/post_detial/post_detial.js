// pages/posts/post_detial/post_detial.js
var postData = require("../../../data/post_data.js");
var app = getApp();//获取全局的数据
Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var postId = options.id;
    var postDetail = postData.postList[postId];
    var postCollect = wx.getStorageSync('postCollected');
    if (postCollect) {
      var collected = postCollect[postId];
      this.setData({
        collected: collected
      });
    } else {
      var postCollect = {};
      postCollect[postId] = false;
      wx.setStorageSync('postCollected', postCollect);
    }
    this.setData({
      postDetail: postDetail,
      postId: postId
    });
    this.setAudioListener();
    var self = this;
    if (app.globalData.g_isPlayingMusic && app.globalData.g_PlayingMusicPostId === postId) {
      //将音乐的播放状态存储于全局中中
      self.setData({
        isPlayingMusic: true
      });
    }
  },
  setAudioListener: function () {
    var self = this;
    //监听总控开关对音乐的控制
    wx.onBackgroundAudioPlay(function () {
      if (app.globalData.g_PlayingMusicPostId === self.data.postId) {
        self.setData({
          isPlayingMusic: true
        });
      }

      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_PlayingMusicPostId = self.data.postId;
    });
    wx.onBackgroundAudioPause(function () {
      self.setData({
        isPlayingMusic: false
      });
      app.globalData.g_PlayingMusicPostId = null;
      app.globalData.g_isPlayingMusic = false;
    });
    wx.onBackgroundAudioStop(function () {
      self.setData({
        isPlayingMusic: false
      });
      app.globalData.g_PlayingMusicPostId = null;
      app.globalData.g_isPlayingMusic = false;
    })
  },
  onCollection: function () {
    console.log(this.data.postId);
    this.getPostCollectSync();
  },
  getPostCollectSync: function () {
    //同步
    var postCollect = wx.getStorageSync('postCollected');
    var collected = postCollect[this.data.postId];
    collected = !collected;
    postCollect[this.data.postId] = collected;

    this.showToast(postCollect, collected);
    //this.showModal(postCollect, collected);
  },
  getPostCollectAsy: function () {
    //异步
    var self = this;
    wx.getStorage({
      key: 'postCollected',
      success: function (res) {
        // success
        var postCollect = res.data;
        var collected = postCollect[self.data.postId];
        collected = !collected;
        postCollect[self.data.postId] = collected;
        self.showToast(postCollect, collected);
      }
    })
  },
  showToast: function (postCollect, collected) {
    //提示框
    wx.setStorageSync('postCollected', postCollect);
    this.setData({
      collected: collected
    });

    wx.showToast({
      title: collected ? "收藏成功" : "取消成功",
      icon: "success",
      duration: 1000
    });
  },
  showModal: function (postCollect, collected) {
    //模态窗口
    var self = this;
    wx.showModal({
      title: "收藏",
      content: collected ? "是否加入收藏" : "是否取消收藏?",
      showCancel: true,
      cancelText: "否",
      cancelColor: "#333",
      confirmText: "是",
      confirmColor: "#405f80",
      success: function (res) {
        //返回res.confirm为true时，表示用户点击确定按钮
        if (res.confirm) {
          wx.setStorageSync('postCollected', postCollect);
          self.setData({
            collected: collected
          });
        }
      }
    });
  },
  onShareTap: function () {
    //选择框
    var itemList = [
      "分享到朋友圈",
      "分享到qq",
      "分享到微博",
      "分享到空间"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        //res.cancel按取消按钮钮
        //res.tapIndex代表按哪个键的索引
        wx.showModal({
          title: "用户" + itemList[res.tapIndex],
          content: "目前尚不支持分享功能,是否取消" + res.cancel + "?"
        });
      }
    });
  },
  onShareAppMessage: function () {
    var self = this;
    return {
      title: this.data.postDetail.title,
      path: 'pages/welcome/welcome'
    }
  },
  onMusicTap: function () {
    var self = this;
    var isPlayingMusic = this.data.isPlayingMusic;
    var postDetail = postData.postList[self.data.postId];
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      self.setData({
        isPlayingMusic: false
      });
    } else {
      wx.playBackgroundAudio({
        dataUrl: postDetail.music.url,
        title: postDetail.music.title,
        coverImgUrl: postDetail.coverImg
      });
      self.setData({
        isPlayingMusic: true
      });
      app.globalData.g_PlayingMusicPostId = self.data.postId;
    }
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