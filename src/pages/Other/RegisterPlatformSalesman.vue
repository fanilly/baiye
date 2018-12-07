<template>
  <div class="container mj-vux-box">

    <div class="input-box-wapper">
      <div class="input-box-type1">
        <input type="text" v-model="userName" placeholder="请输入用户名" />
      </div>
      <div class="input-box-type1">
        <input type="number" v-model="userPhone" placeholder="请输入手机号" />
      </div>
      <div class="input-box-type1">
        <input placeholder-style="color:#ccc" maxlength="6" v-model='code' type="number" name="code" placeholder="验证码" />
        <div class="btn"
          @click='sendAdminCode'
          :style="{color:beginning ? '#cccccc' : '#000000'}">
            {{beginning ? '倒计时' + time + 's' : '发送验证码'}}
        </div>
      </div>
      <div class="input-box-type1">
        <input type="password" v-model="password" placeholder="请输入密码" />
      </div>
      <div class="input-box-type1">
        <input type="password" v-model="confirmPassword" placeholder="再次确认密码密码" />
      </div>
    </div>

    <footer-submit @handleSubmit="handleSubmit" btn-txt="提交"></footer-submit>

  </div>
</template>
<script>

 /**
  *
  *                    .::::.
  *                  .::::::::.
  *                 :::::::::::
  *             ..:::::::::::'
  *           '::::::::::::'
  *             .::::::::::
  *        '::::::::::::::..
  *             ..::::::::::::.
  *           ``::::::::::::::::
  *            ::::``:::::::::'        .:::.
  *           ::::'   ':::::'       .::::::::.
  *         .::::'      ::::     .:::::::'::::.
  *        .:::'       :::::  .:::::::::' ':::::.
  *       .::'        :::::.:::::::::'      ':::::.
  *      .::'         ::::::::::::::'         ``::::.
  *  ...:::           ::::::::::::'              ``::.
  * ```` ':.          ':::::::::'                  ::::..
  *                    '.:::::'                    ':'````..
  *
  */

  import { registerPlatformSalesman, sendAdminCode } from '@/api/index.js';
  import footerSubmit from '@/components/footerSubmit/footerSubmit.vue';

  export default {
    name: 'RegisterPlatformSalesman',
    props: {
      salesmanid: {
        require: true
      }
    },
    data() {
      return {
        userName: '',
        userPhone: '',
        confirmPassword: '',
        password: '',
        time: 180,
        beginning: false,
        code: '',
      };
    },
    mounted() {

    },
    methods: {
      //发送验证码
      sendAdminCode() {
        if (!this.beginning) {
          this.feedback.Loading.open('发送中');
          sendAdminCode({
            mobile: this.userPhone,
            name: 'verify_register_stores'
          }).then(res => {
            this.feedback.Loading.close()
            console.log('发送验证码', res)
            if (res.data.code == 1) {
              this.feedback.Toast({
                msg: `验证码成功发送至手机：${this.userPhone};请注意查收`,
                timeout: 1200
              })
              //显示倒计时
              this.beginning = true

              //开始倒计时
              this.timer = setInterval(() => {
                let tempTime = this.time;
                if (tempTime == 0) {
                  //倒计时结束
                  clearInterval(this.timer);
                  this.time = 180;
                  this.beginning = false
                  return;
                }
                this.time = tempTime - 1
              }, 1000);
            }
          })
        }
      },
      handleSubmit() {
        if (!this.userName || !this.userName.trim()) {
          this.feedback.Notify({
            msg: '请输入用户名',
            timeout: 1000,
            callback: () => {}
          });
        } else if (!this.userPhone || !this.userPhone.trim()) {
          this.feedback.Notify({
            msg: '请正确输入手机号',
            timeout: 1000,
            callback: () => {}
          });
        } else if (!this.code || !this.code.trim()) {
          this.feedback.Notify({
            msg: '请输入验证码',
            timeout: 1000,
            callback: () => {}
          });
        } else if (!this.password) {
          this.feedback.Notify({
            msg: '请输入密码',
            timeout: 1000,
            callback: () => {}
          });
        } else if (this.password != this.confirmPassword) {
          this.feedback.Notify({
            msg: '两次输入的密码不一致，请检查后重新输入',
            timeout: 1000,
            callback: () => {}
          });
        } else {
          //注册业务员
          registerPlatformSalesman({
            user_id: this.$store.state.user.userid,
            saleman_id: this.salesmanid * 1,
            name: this.userName,
            password: this.password,
            phone: this.userPhone,
            verify_code: this.code,
          }).then(res => {
            if (res.data.code == 1) {
              this.feedback.Toast({
                msg: res.data.info,
                timeout: 1200
              });
              setTimeout(() => {
                this.$router.replace({
                  name: 'Index'
                });
              }, 1000);
            } else {
              this.feedback.Toast({
                msg: res.data.info,
                timeout: 1200
              });
            }
          })
        }
      }
    },
    components: {
      footerSubmit
    }
  };

</script>
<style lang="less" scoped>
  .container {
    width: 100%;
    min-height: 100vh;
    background-color: #f7f7f7;
  }

  .input-box-type1 {
    background-color: #fff;
    position: relative;
    padding: 0 .50rem;
    display: flex;
    border-bottom: 1px solid #f7f7f7;
  }

  .input-box-type1 input {
    font-size: .32rem;
    height: 1.18rem;
    flex: 1;
    border: none;
    font-family: 'Microsoft YaHei', Arial;
  }

  .input-box-type1 .btn {
    line-height: 1.18rem;
    font-size: .32rem;
    padding-left: .30rem;
  }
</style>
