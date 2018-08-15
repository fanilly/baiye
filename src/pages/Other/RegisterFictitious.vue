<template>
  <div class="container">

  </div>
</template>
<script>
  import { registerFictitious } from '@/api/index.js';
  import { SET_USER_INFO } from '@/store/mutation-type.js';

  export default {
    name: 'RegisterFictitious',
    props: {
      shopid: {
        require: true
      },
      salesmanid: {
        require: true
      }
    },
    data() {
      return {
        followData: null
      };
    },
    mounted() {
      this.feedback.Loading.open('关系绑定中');
      registerFictitious({
        user_id: this.$store.state.user.userid,
        shop_id: this.shopid,
        salesman_id: this.salesmanid
      }).then(res => {
        this.feedback.Loading.close();
        this.feedback.Toast({
          msg: res.data.info,
          timeout: 1200
        });
        if (res.data.code == 1) {
          let userInfo = JSON.parse(sessionStorage.getItem('USER_INFO'));
          userInfo.userType = 2;
          this.$store.commit(SET_USER_INFO, userInfo);
          sessionStorage.setItem('USER_INFO', JSON.stringify(userInfo));
          setTimeout(() => {
            this.$router.replace({
              name: 'Center'
            })
          }, 1000);
        } else {
          setTimeout(() => {
            this.$router.replace({
              name: 'Index'
            })
          }, 1000);
        }
      })
    }
  };

</script>
<style lang="less" scoped>
  .container {
    width: 100%;
  }
</style>
