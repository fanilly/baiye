<template>
  <div class="container" v-if="detail">
    <h1 class="issue-title">{{detail.title}}</h1>
    <div class="detail" v-html="detail.body"></div>
  </div>
</template>
<script>
  import { getIssueDetail } from '@/api/index.js';

  export default {
    name: 'IssueDetail',
    props: {
      id: {
        require: true
      }
    },
    data() {
      return {
        detail: null
      };
    },
    mounted() {
      this.feedback.Loading.open('加载中');
      getIssueDetail({
        id: this.id
      }).then(res => {
        this.feedback.Loading.close();
        if(res.data.code == 1){
          this.detail = res.data.data[0];
        }else{
          this.feedback.Toast({
            msg:res.data.info,
            timeout: 1200
          })
        }
        console.log(res);
      })
    }
  };

</script>
<style lang="less" scoped>
  .container {
    width: 100%;
    box-sizing: border-box;
    padding: .3rem;
  }

  .detail {
    text-align: left;
    font-size: 0.28rem;
    line-height:0.44rem;
    img {
      max-width: 100%;
    }
  }

  .issue-title {
    text-align: center;
    font-size: .36rem;
    color: #333;
    line-height: .6rem;
    padding-bottom: .08rem;
    position: relative;
    margin: .1rem 0 .2rem 0;
  }
</style>
