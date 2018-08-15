<template>
  <section class="container">
    <form ref="formWapper">
      <main class="page-main">
        <section class="evaluate-rate">
          <div class="evaluate-rate-item">
            <div class="lside">请打分</div>
            <div class="rside">
              <rate slot="left" v-model="score" size="42px"></rate>
            </div>
            <div class="tags-wapper">
              <span :class="{'tags-item':true,active:choosedTags[index]}" v-for="item,index in tags" @click="handleChooseTags(index)">{{item.name}}</span>
            </div>
          </div>
        </section>
        <div class="textarea-wapper">
          <textarea class="textarea" v-model="evaluateText" name="textarea" placeholder="请输入评价内容"></textarea>
          <p class="evaluate-total">{{evaluateText.length}}/300</p>
        </div>
      </main>
    </form>
    <footer-submit @handleSubmit="handleSubmit" btn-txt="提交"></footer-submit>
  </section>
</template>
<script>
import { getEvaluateTags, submitEvaluate } from '@/api/index.js';
import rate from '@/components/rate/rate.vue';
import footerSubmit from '@/components/footerSubmit/footerSubmit.vue';

export default {
  props:{
    orderNo:{
      require:true
    }
  },
  data() {
    return {
      evaluateText: '',
      tags:[],
      choosedTags:[],
      score: 5 //商家评分
    };
  },
  watch: {
    //限制长度为100个字符
    evaluateText(now) {
      this.evaluateText = now.substr(0, 300);
    }
  },
  methods: {

    //提交评论
    handleSubmit() {
      let chooseTag = '';
      this.choosedTags.forEach((item,index)=>{
        if(item) chooseTag+= ` ${this.tags[index].name}`
      });

      submitEvaluate({
        order_no: this.orderNo,
        user_id: this.$store.state.user.userid,
        score: this.score,
        eval: this.evaluateText,
        tag: chooseTag
      }).then(res=>{
        this.feedback.Toast({
          msg:res.data.info,
          timeout:1500
        })
        if (res.data.code == 1) {
          setTimeout(()=>{
            this.$router.go(-1);
          },1000);
        }
      })
    },

    handleChooseTags(index){
      this.choosedTags.splice(index, 1, !this.choosedTags[index])
    }

  },

  mounted(){
    getEvaluateTags({
      user_id:this.$store.state.user.userid
    }).then(res=>{
      if(res.data.code == 1){
        this.tags = res.data.data;
        this.choosedTags = res.data.data.map(item=>false);
      }
    })
  },

  components: {
    rate,
    footerSubmit
  }
};

</script>
<style lang="less" scoped>
@import './Evaluate.less';

</style>
