import axios from 'axios';
export default function() {
  return new Promise((resolve, reject) => {
    // axios.post('/index/login/get_user_info').then(res => {
    //   if (res.data.code == 9) {
    //     // location.href = 'https://food.zzebz.com/index/login/login';
    //     resolve(res);
    //   } else {
    //     resolve(res);
    //   }
    // }).catch(err => {
    //   reject(err);
    // });
    console.log(123);
    let userInfo = {
      userid:1,
      nickName:'卮言',
      userType:1,
      avatar:'http://d.hiphotos.baidu.com/image/pic/item/b17eca8065380cd79a75c52cad44ad3458828183.jpg'
    }
    localStorage.setItem('USER_INFO',JSON.stringify(userInfo));
    resolve(userInfo)
  });
}
