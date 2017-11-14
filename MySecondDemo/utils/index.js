'use strick'
import promise from '../lib/promise.js';
import config from './config.js';
import * as Mock from './mock.js';


const DEFAULT_REQUEST_OPTIONS = {
  url: '',
  data: {},
  header: {
    "Content-Type": "application/json"
  },
  method: 'GET',
  dataType: 'json'
}

let util = {
  // 如果环境配置为dev环境，则打印参数内容
  isDEV: config.isDev,
  log() {
    this.isDEV && console.log(...arguments)
  },
  // 封装 alert 弹出窗口
  alert(title = '提示', content = config.defaultAlertMsg) {
    if ('object' === typeof content) {
      content = this.isDEV && JSON.stringify(content) || config.defaultAlertMsg;
    }
    wx.showModal({
      title: title,
      content: content,
    })
  },
  // 封装本地缓存数据的读取功能
  getStorageData(key, cb) {
    let self = this;
    // 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口
    wx.getStorage({
      key: key,
      success: function (res) {
        cb && cb(res.data);
      },
      fail: function (err) {
        let msg = err.errMsg || '';
        if (/getStorage:fail/.test(msg)) {
          self.setStorageData(key);
        }
      }
    })
  },
  setStorageData(key, value = '', cb) {
    wx.setStorage({
      key: key,
      data: value,
      success: function () {
        cb && cb();
      }
    })
  },
  // 常用的网络请求方法 wx.request 进行封装
  request(opt) {
    let options = Object.assign({}, DEFAULT_REQUEST_OPTIONS, opt);
    let { url, data, header, method, dataType, mock = false } = options;
    let self = this;
    return new Promise((resolve, reject) => {
      //如果请求接口调用时候，包含有参数 mock = true，会自动调用相应的 mock 数据，
      //如果没有这个参数，就走正常流程去调数据
      if (mock) {
        let res = {
          statusCode: 200,
          data: Mock[url]
        };
        if (res && res.statusCode === 200 && res.data) {
          resolve(res.data);
        } else {
          self.alert('提示', res);
          reject(res);
        }
      } else {
        wx.request({
          url: url,
          data: data,
          header: header,
          method: method,
          dataType: dataType,
          success: function (res) {
            if (res && res.statusCode === 200 && res.data) {
              resolve(res.data);
            } else {
              self.alert('提示', res);
              reject(res);
            }
          },
          fail: function (err) {
            self.log(err);
            self.alert('提示', err);
            reject(err);
          },
          complete: function (res) { },
        })
      }

    })

  }

}
export default util;


// // 调用方法如下
// util.request({
//   url: 'list',
//   mock: true,
//   data: {
//     tag: '微信热门',
//     start: 1,
//     days: 3,
//     pageSize: 5,
//     langs: 'en'
//   }
// }).then(res => {
//   // do something
// })