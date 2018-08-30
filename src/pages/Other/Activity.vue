<template>
  <section class="container" v-if="activityData" :style="{'background': activityData.background_color}">
    <section class="wapper">
      <img class="header-img" :src="activityData.head_img">
      <section class="activity-goods">
        <h1 class="activity-title" :style="{'color': activityData.font_color}">{{activityData.name}}</h1>
        <p class="activity-time" :style="{'color': activityData.font_color}">活动时间：{{activityData.start_time}} 至 {{activityData.end_time}}</p>


        <!--==============================
        =            买赠活动            =
        ===============================-->

        <main class="activity-goods-buygift" v-if="activityData.type_config == 0">
          <section class="goods-item" v-for="item,index in activityData.goods" :key="index">
            <section class="goods-item-lside">
              <header class="goods-item-lside-header">
                <img class="goods-img" :src="item.goods_pic" :alt="item.goods_name">
                <div class="goods-info">
                  <h3 class="goods-title">{{item.goods_name}}</h3>
                  <p class="goods-price"><span>￥</span>{{item.act_price}}</p>
                </div>
              </header>
              <div class="goods-item-lside-buy">立即购买</div>
            </section>
            <section class="goods-item-rside">
              <img class="goods-img" :src="item.give_pic" :alt="item.give_name">
              <h3 class="goods-title">{{item.give_name}}</h3>
              <p class="goods-price"><span>￥</span>{{item.cost_price}}</p>
            </section>
            <section class="goods-item-badge">送</section>
          </section>
        </main>

        <!--====  End of 买赠活动  ====-->


        <!--==============================
        =            折扣活动            =
        ===============================-->

        <main class="activity-goods-discount" v-if="activityData.type_config == 1">
          <div v-for="item,index in activityData.goods" :key="index">
            <section class="goods-item goods-item-ogg" v-if="index%2 == 1">
              <img class="goods-img" :src="item.goods_pic" alt="">
              <div class="goods-item-info">
                <h3 class="goods-title">{{item.goods_name}}</h3>
                <p class="goods-old-price"><span>￥</span>{{item.cost_price}}</p>
                <p class="goods-price"><span>￥</span>{{item.act_price}}</p>
                <div>
                  <div class="goods-buy">立即抢购</div>
                </div>
              </div>
            </section>
            <section class="goods-item goods-item-even" v-if="index%2 == 0">
              <div class="goods-item-info">
                <h3 class="goods-title">{{item.goods_name}}</h3>
                <p class="goods-old-price"><span>￥</span>{{item.cost_price}}</p>
                <p class="goods-price"><span>￥</span>{{item.act_price}}</p>
                <div>
                  <div class="goods-buy">立即抢购</div>
                </div>
              </div>
              <img class="goods-img" :src="item.goods_pic" alt="">
            </section>
          </div>

        </main>

        <!--====  End of 折扣活动  ====-->

      </section>
    </section>
  </section>
</template>
<script>
  import { getActivityDetail } from '@/api/index.js';

  export default {
    name: 'Activity',
    props: {
      activityid: {
        require: true
      }
    },
    data() {
      return {
        activityData: null
      };
    },
    mounted() {
      getActivityDetail({
        activity_id: this.activityid
      }).then(res=>{
        if(res.data.code == 1){
          this.activityData = res.data.data;
          document.title = res.data.data.name;
        }else{
          this.feedback.Toast({
            msg: res.data.info,
            timeout: 1500
          });
          setTimeout(()=>{
            this.$router.go(-1)
          },1000);
        }
      })
    }
  };

</script>
<style lang="less" scoped>
  .container {
    width: 100%;
    min-height: 100vh;
  }

  .header-img {
    width: 100%;
    display: block;
  }

  .activity-goods {
    padding: .2rem;
    .activity-title {
      font-size: .36rem;
      font-weight: bold;
      padding: .2rem;
    }
    .activity-goods {
      font-size: .28rem;
      padding-bottom: .3rem;
    }
  }

  .activity-goods-buygift {
    margin-top: .5rem;
    .goods-item {
      padding: 0;
      display: flex;
      position: relative;
      align-items: center;
      padding-top: .2rem;
      margin-bottom: .2rem;
      &-lside {
        flex: 1;
        background-color: #fff;
        border-radius: .1rem;
        margin-right: .2rem;
        overflow: hidden;
        height: 3.2rem;
        padding: .2rem;
        box-shadow: 0 2px 6px rgba(0,0,0,.1);
        &-header {
          display: flex;
          .goods-img {
            width: 2rem;
            height: 2rem;
          }
          .goods-info {
            padding-left: .2rem;
            display: flex;
            overflow: hidden;
            flex-direction: column;
            height: 2rem;
            justify-content: space-between;
            .goods-title {
              font-size: .28rem;
              line-height: .36rem;
              max-height: 1.08rem;
              color: #1b1b1f;
              font-weight: normal;
              text-align: left;
              overflow : hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
            }
            .goods-price {
              text-align: left;
              font-size: .36rem;
              font-weight: 800;
              color: #ec1548;
              span{
                font-size: .22rem;
              }
            }
          }
        }
        &-buy {
          background-color: #ec1548;
          font-size: .24rem;
          height: .6rem;
          color: #fff;
          line-height: .6rem;
          margin-top: .2rem;
        }
      }
      &-rside {
        width: 2.4rem;
        background-color: #fff;
        border-radius: .1rem;
        height: 3.2rem;
        padding: .2rem;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0,0,0,.1);
        .goods-img {
          width: 2rem;
          height: 2rem;
        }
        .goods-title {
          font-size: .28rem;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: normal;
          text-align: left;
          padding: .1rem 0 0;
        }
        .goods-price {
          text-align: left;
          color: #999;
          font-size: .28rem;
          span {
            font-size: .22rem;
            text-align: left;
          }
        }
      }
      &-badge {
        width: .8rem;
        height: .6rem;
        background: #ec1548;
        color: #fff;
        position: absolute;
        border-bottom-left-radius: .45rem;
        right: 0;
        top: 0;
        line-height: .6rem;
        font-size: .28rem;
        &:before {
          content: ' ';
          display: block;
          height:.2rem;
          width: 0;
          border-width: .1rem .05rem;
          border-style: solid;
          border-color: transparent #ff7999 #ff7999 transparent;
          position: absolute;
          left: -.1rem;
          top: 0;
        }
      }
    }
  }

  .activity-goods-discount {
    margin-top: .5rem;
    .goods-item{
      display: flex;
      align-items: center;
      background-color: #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,.1);
      padding: .2rem;
      margin-bottom: .2rem;
      position: relative;
      .goods-img {
        width: 2.6rem;
        height: 2.6rem;
      }
      &-info {
        height: 2.6rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .goods-title {
          font-size: .32rem;
          color: #1b1b1f;
          font-weight: 600;
          line-height: .46rem;
          height: .92rem;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .goods-price {
          font-size: .32rem;
          color: #1b1b1f;
          span { font-size: .24rem; }
        }
        .goods-old-price{
          font-size: .28rem;
          color: #999;
          text-decoration: line-through;
          padding-left: .2rem;
          span { font-size: .24rem; }
        }
        .goods-buy {
          width: 2rem;
          display: inline-block;
          height: .6rem;
          line-height: .6rem;
          background-color: #ec1548;
          border-radius: .3rem;
          margin: 0 auto;
          color: #fff;
          font-size: .24rem;
          text-align: center;
        }
      }
    }
    .goods-item-ogg {
      text-align: left;
      .goods-img {
        margin-right: .2rem;
      }
    }
    .goods-item-even {
      text-align: right;
      .goods-img {
        margin-left: .2rem;
      }
    }
  }
</style>
