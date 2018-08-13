const wx = require('weixin-js-sdk');
import { getWxSettings } from './index.js';
export default function() {
  return new Promise(resolve => {
    getWxSettings().then(res => {
      let data = res.data.data;
      wx.config({
        debug: true,
        appId: data.appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ['getLocation', 'openlocation']
      });
    });
    console.log('sssssss')
    setTimeout(()=>{
      console.log('success --')
      resolve({
        latitude: 34.79977,
        longitude: 113.66072
      })
    },2000);
    // wx.ready(function() {
    //   console.log('ready')
    //   wx.getLocation({
    //     type: 'wgs84',
    //     success: function(res) {
    //       console.log('get location success')
    //       let latitude = res.latitude;
    //       let longitude = res.longitude;
    //       resolve({ latitude, longitude });
    //     }
    //   });
    // });
  });
}
