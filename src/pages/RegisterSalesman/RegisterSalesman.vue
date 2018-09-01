<template>
  <div class="container mj-vux-box">

    <div class="ziset" v-if="shopinfo">
      <div class="shop">
        <img :src="headBg" class="bg" />
        <div class="fix">
          <img :src="shopinfo.avatar" class="shopimg" />
          <div class="shopname">{{shopinfo.name}}</div>
        </div>
      </div>
      <div class="sg">
        <div class="slin">
          <input type="text" v-model="userName" placeholder="请填写您的姓名" />
        </div>
        <div class="slin">
          <input type="number" v-model="userPhone" placeholder="请填写您的手机号" />
        </div>
      </div>

      <footer-submit @handleSubmit="handleSubmit" btn-txt="提交"></footer-submit>
    </div>

  </div>
</template>
<script>
  import { getPhysicalShopDetail, registerSalesman } from '@/api/index.js';
  import footerSubmit from '@/components/footerSubmit/footerSubmit.vue';

  export default {
    name: 'RegisterSalesman',
    props: {
      shopid: {
        require: true
      }
    },
    data() {
      return {
        shopinfo: null,
        userName: '',
        userPhone: '',
        headBg: require('../../assets/hehezc_02.png')
      };
    },
    mounted() {
      getPhysicalShopDetail({
        user_id: this.$store.state.user.userid,
        id: this.shopid
      }).then(res => {
        if (res.data.code == 1) {
          this.shopinfo = res.data.data;
        } else {
          this.feedback.Toast({
            msg: res.data.info,
            timeout: 1200
          })
        }
      });
    },
    methods: {
      handleSubmit() {
        if (!this.userName || !this.userName.trim()) {
          this.feedback.Notify({
            msg: '请填写您的姓名',
            timeout: 1200,
            callback: () => {
            }
          });
        } else if (!(/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(this.userPhone))) {
          this.feedback.Notify({
            msg: '请正确输入手机号',
            timeout: 1200,
            callback: () => {
            }
          });
        } else {
          //注册业务员
          registerSalesman({
            user_id: this.$store.state.user.userid,
            shop_id: this.shopid,
            name: this.userName,
            phone: this.userPhone
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
  @import './RegisterSalesman.less';
</style>
