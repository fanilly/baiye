import axios from 'axios';

export default function(userToken,goLogin) {
  return new Promise((resolve, reject) => {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      let userInfo = {
        userid: 169,
        nickName: '发光的闪闪闪',
        userType: 2,
        subscribe: true,
        waiter_id:0,
        virtual_id:0,
        avatar: 'http://d.hiphotos.baidu.com/image/pic/item/b17eca8065380cd79a75c52cad44ad3458828183.jpg'
      }
      sessionStorage.setItem('USER_INFO', JSON.stringify(userInfo));
      resolve(userInfo)
    } else {
      sessionStorage.setItem('USER_TOKEN',userToken);
      axios.post('https://shop.live.zzebz.com/index/login/get_user_info',{
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
            subscribe: resData.subscribe,
            waiter_id: resData.waiter_id,
            virtual_id: resData.virtual_id
          };
          sessionStorage.setItem('USER_INFO', JSON.stringify(userInfo));
          resolve(userInfo);
        }
      }).catch(err => {
        reject(err);
      });
    }

  });
}
