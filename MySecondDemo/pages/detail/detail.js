'use strict';

import util from '../../utils/index';
import config from '../../utils/config';

// WxParse HtmlFormater 用来解析 content 文本为小程序视图
import WxParse from '../../lib/wxParse/wxParse';
// 把 html 转为化标准安全的格式
import HtmlFormater from '../../lib/htmlFormater';

let app = getApp();
Page({
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
        util.log(data);
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
      day = timeStr.clice(8, 10);
    return `${year}/${month}/${day}`;
  }

});