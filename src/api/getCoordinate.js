const wx = require('weixin-js-sdk');
import { getWxSettings } from './index.js';
export default function() {
  return new Promise(resolve => {
    const isDev = process.env.NODE_ENV === 'development';
    getWxSettings().then(res => {
      let data = res.data.data;
      wx.config({
        debug: isDev,
        appId: data.appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['getLocation', 'openlocation']
      });
    });
    if (isDev) {
      if (sessionStorage.getItem('USER_COORDINATE')) {
        resolve(JSON.parse(sessionStorage.getItem('USER_COORDINATE')));
      } else {
        setTimeout(() => {
          const coordinate = {
            latitude: 34.79977,
            longitude: 113.66072
          };
          sessionStorage.setItem('USER_COORDINATE', JSON.stringify(coordinate));
          resolve(coordinate);
        }, 1000);
      }
    } else {
      if (sessionStorage.getItem('USER_COORDINATE')) {
        resolve(JSON.parse(sessionStorage.getItem('USER_COORDINATE')));
      } else {
        if (global.browserIsWeChat) {
          wx.ready(function() {
            wx.getLocation({
              type: 'wgs84',
              success: function(res) {
                const coordinate = { latitude: res.latitude, longitude: res.longitude };
                sessionStorage.setItem('USER_COORDINATE', JSON.stringify(coordinate));
                resolve(coordinate);
              }
            });
          });
        } else {
          navigator.geolocation.getCurrentPosition(function(position) {
            const coordinate = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            sessionStorage.setItem('USER_COORDINATE', JSON.stringify(coordinate));
            resolve(coordinate);
          });
        }
      }
    }
  });
}
