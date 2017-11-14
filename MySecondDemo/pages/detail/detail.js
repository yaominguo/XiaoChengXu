'use strict';

import util from '../../utils/index';
import config from '../../utils/config';

// WxParse HtmlFormater 用来解析 content 文本为小程序视图
import WxParse from '../../lib/wxParse/wxParse';
// 把 html 转为化标准安全的格式
import HtmlFormater from '../../lib/htmlFormater';

let app = getApp();
Page({
  data: {
    detailData: {}
  },
  onLoad(option) {
    /*
     * 函数 `onLoad` 会在页面初始化时候加载运行，其内部的 `option` 是路由跳转过来后的参数对象。
     * 我们从 `option` 中解析出文章参数 `contendId`，然后通过调用 `util` 中封装好的 `request` 函数来获取 `mock` 数据。
     */
    let id = option.contentId || 0;
    this.init(id);
  },
  init(contentId) {
    if (contentId) {
      this.requestDetail(contentId).then((data) => {
        this.configPageData(data);
      }).then(() => {
        this.articleConvert();
      })
    }
  },
  articleConvert() {
    // this.data.detailData 是之前我们通过 setData 设置的响应数据
    let htmlContent = this.data.detailData && this.data.detailData.content;

    /*第一个参数 article 很重要，在 WxParse 中，
     *我们传入了当前对象 this，当变量 htmlContent 解析之后，
     *会把解析后的数据赋值给当前对象，并命名为 article。
     *所以当文章数据解析后，当前环境上下文中已经存在了数据 article，可以直接在 detail.wxml 中引用this.data.article。
    */
    WxParse.wxParse('article', 'html', htmlContent, this, 0);
  },
  configPageData(data) {
    if (data) {
      // 同步数据到 Model 层，Model 层数据发生变化的话，视图层会自动渲染
      this.setData({
        detailData: data
      });
      //调用了小程序自带的方法来动态设置标题
      let title = this.data.detailData.title || config.defaultBarTitle;
      wx.setNavigationBarTitle({
        title: title
      })
    }
  },
  requestDetail(contentId) {
    return util.request({
      url: 'detail',
      mock: true,
      data: {
        source: 1
      }
    }).then(res => {
      let formatUpdateTime = this.formatTime(res.data.lastUpdateTime);
      res.data.formatUpdateTime = formatUpdateTime;
      return res.data;
    })
  },
  formatTime(timeStr = '') {
    let year = timeStr.slice(0, 4),
      month = timeStr.slice(5, 7),
      day = timeStr.slice(8, 10);
    return `${year}/${month}/${day}`;
  }

});