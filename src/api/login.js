import axios from 'axios';

export default function(userToken) {
  return new Promise((resolve, reject) => {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      let userInfo = {
        userid: 67,
        nickName: '发光的闪闪闪',
        userType: 2,
        subscribe: true,
        avatar: 'http://d.hiphotos.baidu.com/image/pic/item/b17eca8065380cd79a75c52cad44ad3458828183.jpg'
      }
      sessionStorage.setItem('USER_INFO', JSON.stringify(userInfo));
      resolve(userInfo)
    } else {
      axios.post('https://food.zzebz.com/index/login/get_user_info',{
        user_token:userToken
      }).then(res => {
        if (res.data.code == 0) {
          location.href = 'https://food.zzebz.com/index/login/login?jump_url=' + location.pathname.replace(/\//g, '^');
        } else if (res.data.code == 1) {
          let resData = res.data.data;
          const userInfo = {
            userid: resData.user_id,
            userType: resData.usertype,
            nickName: resData.nickname,
            avatar: resData.headimgurl,
            subscribe: resData.subscribe
          };
          sessionStorage.setItem('USER_INFO', JSON.stringify(userInfo));
          resolve(res);
        }
      }).catch(err => {
        reject(err);
      });
    }

  });
}
