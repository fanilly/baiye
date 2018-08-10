<template>
  <section class="container">
    <header class="header">
      <span @click="handleAddGoods"><i class="iconfont icon-iconjia"></i></span>
      <div class="text" @click="handleAddGoods">继续添加</div>
      <div class="del-btn" @click="handleClearTrolley"><span><i class="iconfont icon-shanchu"></i></span>清空</div>
    </header>
    <main class="page-main">
      <section class="item-wapper" v-for="sub,key of trolleys" :key="key">
        <section class="cate-name">{{sub.cate_name}}</section>
        <section class="item" v-for="item,index of sub.goods" :key="index">
          <img class="item-pic" :src="item.img_url">
          <div class="item-lside">
            <h3>{{item.title}}</h3>
            <p v-if="item.attr">{{item.attr}}</p>
          </div>
          <div class="item-center"><span>￥</span>{{item.price}}</div>
          <div class="item-rside">
            <span class="icon-box reduce" @click="changeCartGoodsNum(item.id,item.attr_id,'cut',index,key)"><i class="iconfont icon-iconjian"></i></span>
            <span class="count-box">{{item.number}}</span>
            <span class="icon-box plus" @click="changeCartGoodsNum(item.id,item.attr_id,'add',index,key)"><i class="iconfont icon-iconjia"></i></span>
          </div>
        </section>
      </section>
    </main>
    <footer-trolley
      lable="去结算"
      :totalMoney="totalMoney"
      :total="trolleysTotal"
      @handleClickBtn="handleGoSettlement"
    ></footer-trolley>
  </section>
</template>
<script>
  import { getCartLists, clearCartLists, changeCartGoodsNum } from '@/api/index.js';
  import footerTrolley from '@/components/footerTrolley/footerTrolley.vue';
  import storageUtils from '@/utils/Storage.js';
  // import
  export default {
    name: 'trolley',
    props: {
      shopid: {
        require: true
      }
    },
    data() {
      return {
        trolleys: [],
        trolleysTotal: 0,
        totalMoney: 0
      };
    },
    methods: {
      handleAddGoods() {
        this.$router.go(-1);
      },

      changeCartGoodsNum(goodsId, attrId, type, index, parentIndex) {
        if(type === 'add'){
          this.trolleys[parentIndex]['goods'][index].number ++;
        }else{
          this.trolleys[parentIndex]['goods'][index].number --;
          if(this.trolleys[parentIndex]['goods'][index].number < 1){
            this.trolleys[parentIndex]['goods'].splice(index,1);
            if(this.trolleys[parentIndex]['goods'].length == 0){
              this.trolleys.splice(parentIndex,1);
            }
          }
        }
        changeCartGoodsNum({
          id: goodsId,
          shop_id: this.shopid,
          user_id: this.$store.state.user.userid,
          attr_id: attrId,
          is_waimai: 1,
          change: type
        }).then(res => {
          if(res.data.code != 1){
            this.feedback.Toast({
              msg:'网络繁忙',
              timeout: 1200
            });
            this.getCartLists();
          }
        });
      },

      // 去结算
      handleGoSettlement() {
        this.$router.push({
          name: 'Settlement'
        });
      },

      //获取购物车数据
      getCartLists() {
        getCartLists({
          is_waimai: 1,
          shop_id: this.shopid,
          user_id: this.$store.state.user.userid
        }).then(res => {
          console.log(res);
          if (res.data.code == 1) {
            this.choosedTotalNum = res.data.data.total_num;
            this.choosedTotalPrice = res.data.data.total_price;
            this.trolleys = res.data.data.data;
          }
        })
      },

      //清空购物车
      handleClearTrolley() {
        this.feedback.Confirm({
          title: '',
          msg: '您确定要清空购物车吗？',
          options: [{
            txt: '取消',
            color: '#999'
          }, {
            txt: '确定',
            color: '#0bb20c',
            callback: () => {
              clearCartLists({
                is_waimai: 1,
                shop_id: this.shopid,
                user_id: this.$store.state.user.userid
              }).then(res => {
                if (res.data.code == 1) {
                  this.trolleysTotal = 0;
                  this.trolleys = [];
                  this.totalMoney = 0;
                }
                this.feedback.Toast({
                  msg: res.data.info,
                  timeout: 1500,
                  callback: () => { this.$router.go(-1); }
                });
              })
            }
          }]
        });

      }
    },
    mounted() {
      this.getCartLists();
    },
    components: {
      footerTrolley
    }
  };

</script>
<style lang="less"
  scoped>
  @import './Trolley.less';

</style>
