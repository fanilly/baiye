<template>
  <section class="container">
    <header class="header-search" @click="jumpSearch">
      <div class="header-search-input">{{word}}</div>
    </header>
    <section class="header-palceholder"></section>

    <main class="scroller-container">
      <scroller @getData="getLists">
        <!-- list -->
        <div class="list" v-for="item,index in lists" :key="index">
          <div class="item scroll-item" @click.stop="goShopIndex(item.shop_id)">
            <div class="lside">
              <img :src="item.shop_avatar" alt="" />
            </div>
            <div class="center">
              <div class="title">{{item.shop_name}}</div>
              <div class="sale">月销 {{item.month_sell}} 笔</div>
              <div class="badge">
                <span class="badge-item">{{item.is_dada ? '达达配送' : '商家自配'}}</span>
              </div>
            </div>
            <div class="rside">
              <img :src="coordinateIcon" />
              <span>{{item.distance}}</span>
            </div>
          </div>
          <div class="item item-goods" v-for="iitem,i in item.goods" :key="i" @click.stop="goShopIndex(item.shop_id,iitem.cate_id,iitem.id)">
            <div class="lside">
              <img :src="iitem.img_url" />
            </div>
            <div class="center">
              <div class="title">{{iitem.title}}</div>
              <div class="sale">月销 {{iitem.sell_num}} 笔</div>
              <div class="badge">
                <span class="unit">￥</span>
                <span class="price">{{iitem.price}}</span>
              </div>
            </div>
          </div>
        </div>

          <load-more v-if="!noLists" :show-loading="!listLoadedAll && !noLists" :tip="!listLoadedAll ? '加载中' : '已加载全部数据'" background-color="#fbf9fe"></load-more>

        <!-- empty page -->
        <div class="empty-status" v-if="noLists">
          <img :src="emptyIcon" />
          <div class="desc">未搜索到关于
            <span>“{{word}}”</span>的结果</div>
          <div class="btn" @click="jumpSearch">换个关键词试试</div>
        </div>
      </scroller>
    </main>

  </section>
</template>

<script>

  import scroller from '../../components/scroller/scroller.vue';
  import { LoadMore } from 'vux';
  import { getWxSettings, getSearchResult } from '@/api/index.js';
  import { SET_SEARCH_RESULT } from '@/store/mutation-type.js';

  export default {
    name: 'SearchResult',
    props: {
      word: {
        require: true,
        default: ''
      }
    },
    data() {
      return {
        coordinateIcon: require('../../assets/baiye/icon01@2x.png'),
        emptyIcon: require('../../assets/emptystatus.png'),
        lists:[],
        page: 1,
        allowLoadMore: true,
        listLoadedAll: false,
        noLists: false
      };
    },
    methods: {
      jumpSearch(){
        this.$router.replace({
          name:'Search'
        });
      },

      // 获取列表
      getLists() {
        if (!this.allowLoadMore || this.listLoadedAll || this.noLists) return;
        this.allowLoadMore = false;
        getSearchResult({
          latitude: this.$store.state.coordinate.latitude,
          longitude: this.$store.state.coordinate.longitude,
          search: this.word,
          page: this.page
        }).then(res => {
          console.log(res)
          if (res.data.data.length < 20) this.listLoadedAll = true;
          if (res.data.data.length == 0 && this.lists.length == 0) this.noLists = true;
          this.lists.push(...res.data.data);
          this.allowLoadMore = true;
          this.page++;
        })
      },

      goShopIndex(shopId,cateId,goodsId){
        if(cateId && goodsId){
          this.$store.commit(SET_SEARCH_RESULT, {
            cateId,
            goodsId
          });
        }
        this.$router.push({
          name:'Shop',
          params:{
            shopid:shopId
          }
        })
      }
    },
    mounted() {
      this.getLists();
      getWxSettings().then(res => {
        let data = res.data.data;
        this.wx.config({
          debug: global.isDev,
          appId: data.appid,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['chooseWXPay']
        });
      });
    },
    components: {
      scroller,
      LoadMore,
    }
  };

</script>

<style lang="less"
  scoped>
  @import './SearchResult.less';

</style>
