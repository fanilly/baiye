<template>
  <section class="container">
    <header class="header-search">
      <input class="header-search-input"
        type="search"
        autofocus="autofocus"
        placeholder="请输入商品名称"
        v-model="searchKeyWord"
        @keyup.enter="handleSearch" />
      <button class="start-search" @click="handleSearch">搜索</button>
    </header>
    <section class="header-palceholder"></section>


    <div class="host b20" v-if="hotData.length != 0">
      <div class="tit1">热门搜索</div>
      <div class="tips">
        <span v-for="item,index in hotData" :key="index" @click="quickSearchKeyWord(item)">{{item}}</span>
      </div>
    </div>

    <div class="host">
      <div class="tit1">历史搜索
        <div class="empty" v-if="history.length != 0" @click="clearHistory">
          <img :src="delIcon" />
          <span>清空历史记录</span>
        </div>
      </div>
      <div class="list">
        <span v-for="item,index in history" :key="index" @click="quickSearchKeyWord(item)">{{item}}</span>
      </div>
    </div>

  </section>
</template>

<script>
  import { getHotSearchKeyword } from '@/api/index.js';
  export default {
    name: 'Search',
    data() {
      return {
        showInitPage: true,
        hotData:[],
        history:[],
        delIcon:require('../../assets/delite.png'),
        searchKeyWord: '',
      };
    },
    methods: {
      //去搜索
      handleSearch() {
        if(this.searchKeyWord != '' && this.searchKeyWord.trim() != '')
        this.saveHistory().then(()=>{
          this.$router.replace({
          name:'SearchResult',
            params:{
              word: this.searchKeyWord
            }
          });
        })
      },

      //快捷搜索
      quickSearchKeyWord(searchKeyWord){
        this.searchKeyWord = searchKeyWord;
        this.handleSearch();
      },

      //清除历史记录
      clearHistory(){
        this.feedback.Confirm({
          title: '',
          msg: '您确定要清空搜索历史吗？搜索历史一旦被清空将无法找回',
          options: [{
            txt: '取消',
            color: '#999'
          }, {
            txt: '确定',
            color: '#0bb20c',
            callback: () => {
              localStorage.removeItem('SEARCH_KEYWORD');
              this.history = [];
              this.feedback.Toast({
                msg:'清除成功'
              })
            }
          }]
        });
      },

      //获取并展示历史记录
      getHistory(){
        let tempHistory = localStorage.getItem('SEARCH_KEYWORD');
        if(!tempHistory) return;
        this.history = JSON.parse(tempHistory);
      },

      //保存历史记录
      saveHistory(){
        return new Promise(resolve=>{
          let tempHistory = this.history.length != 0 ? [...this.history] : [];
          if(tempHistory.length>=10) tempHistory.pop();
          tempHistory.unshift(this.searchKeyWord);
          tempHistory = Array.from(new Set(tempHistory));
          localStorage.setItem('SEARCH_KEYWORD',JSON.stringify(tempHistory));
          resolve();
        });
      }
    },
    mounted() {
      this.getHistory();
      //获取热搜关键词
      getHotSearchKeyword().then(res=>{
        if(res.data.code == 1){
          this.hotData = res.data.data;
        }
      });
    }
  };

</script>

<style lang="less"
  scoped>
  @import './Search.less';

</style>
