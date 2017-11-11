//接收数据，只能接收相对地址
var postData = require("../../data/post_data");
Page({
  data: {
    //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    // 而这个动作A的执行，是在onLoad函数执行之后发生的
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({ postkey: postData.postList });
  },
  onPostTap: function (event) {
    //捕获当前元素的的id，注意自定义属性dataset会将所有的大小写字母转为小写
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post_detial/post_detial?id=' + postId
    });
    this.getStoregeSync(postId);
  },
  getStoregeSync: function (postId) {
    var adds = wx.getStorageSync('adds');
    if (adds) {
      var i = adds[postId];
      i++;
      if(!i){
        i=0;
      }
      adds[postId] = i;
       wx.setStorageSync('adds', adds);
    } else {
      var adds = {};
      adds[postId] = 0;
      wx.setStorageSync('adds', adds);
    }
     this.setData({
        adds:adds
      });
  },
  onSwiperTap: function (event) {
    //获取触发该事件的元素的id，注意自定义属性dataset会将所有的大小写字母转为小写
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post_detial/post_detial?id=' + postId
    })

  },
})