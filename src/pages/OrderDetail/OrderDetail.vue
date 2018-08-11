<template>
  <div class="container" v-if="order">

    <div class="nows" v-if="order.status==0"><img :src="icon01" /><span>待付款</span></div>
    <div class="nows" v-if="order.status==1"><img :src="icon02" /><span>待接单</span></div>
    <div class="nows" v-if="order.status==2"><img :src="icon03" /><span>已接单</span></div>
    <div class="nows" v-if="order.status==3"><img :src="icon04" /><span>配送中</span></div>
    <div class="nows" v-if="order.status==4"><img :src="icon05" /><span>待评价</span></div>
    <div class="nows" v-if="order.status==5"><img :src="icon06" /><span>已完成</span></div>
    <div class="nows" v-if="order.status==6"><img :src="icon07" /><span>已退款</span></div>


    <div class='main'>
      <div class='mation'>
        <div class='sin'>
          <div class='sl'>订单号</div>
          <div class='sr'>{{order.order_no}}</div>
        </div>
        <div class='sin' v-if='order.is_waimai != 1'>
          <div class='sl'>餐桌</div>
          <div class='sr'>{{order.table_name}}</div>
        </div>
        <div class='sin' v-if="order.coupon!=''">
          <div class='sl'>优惠</div>
          <div class='sr'>{{order.coupon}}</div>
        </div>
        <div class='sin' v-if="order.status == 0">
          <div class='sl'>应付金额</div>
          <div class='sr'>
            <span class='small'>¥</span>{{order.actually_money}}</div>
        </div>
        <div class='sin' v-if="order.status > 0">
          <div class='sl'>实付金额</div>
          <div class='sr'>
            <span class='small'>¥</span>{{order.actually_money}}</div>
        </div>

        <div class='sin' v-if="order.status > 0">
          <div class='sl'>支付方式</div>
          <div class='sr' v-if="order.pay_type == 0">未支付</div>
          <div class='sr' v-if="order.pay_type == 1">微信支付</div>
          <div class='sr' v-if="order.pay_type == 2">余额支付</div>
        </div>
        <div class='sin' v-if="order.status > 0">
          <div class='sl'>支付时间</div>
          <div class='sr'>{{order.pay_time}}</div>
        </div>
        <div class='sin' v-if="order.gift!=''">
          <div class='sl'>赠品</div>
          <div class='sr'>{{order.gift}}</div>
        </div>
        <div class='sin' v-if="order.remark!=''">
          <div class='sl'>备注内容</div>
          <div class='sr'>{{order.remark}}</div>
        </div>
      </div>

      <div class='mation' v-if="order.is_waimai == 1">
        <div class='sin'>
          <div class='sl'>收货地址</div>
          <div class='sr'>{{order.receiver_city.province.name}}{{order.receiver_city.city.name}}{{order.receiver_city.area.name}}{{order.receiver_address}}</div>
        </div>
        <div class='sin'>
          <div class='sl'>收货人</div>
          <div class='sr'>{{order.receiver_name}}</div>
        </div>
        <div class='sin'>
          <div class='sl'>联系电话</div>
          <div class='sr'>{{order.receiver_phone}}</div>
        </div>
        <div class='sin' v-if="order.statusCode==2 || order.statusCode==3">
          <div class='sl'>配送方式</div>
          <div class='sr' v-if="order.shipping_type == 1">达达配送</div>
          <div class='sr' v-if="order.shipping_type == 0">店铺自配</div>
        </div>
      </div>


      <div class='mation' v-if="order.is_waimai == 1 && order.shipping_status > 1 && order.shipping_type == 1">
        <div class='sin'>
          <div class='sl'>送货员</div>
          <div class='sr'>{{order.distributor_name}}</div>
        </div>
        <div class='sin'>
          <div class='sl'>联系电话</div>
          <div class='sr'>{{order.distributor_mobile}}</div>
        </div>
      </div>

      <div class='food'>
        <div class='shop'>
          <img :src="order.shop_avatar" />
          <span>{{order.shop_name}}</span>
        </div>
        <div class='flist'>
          <div class='item' v-for="item,index in order.goods">
            <div class='sl'>{{item.title}}
              <span v-if="item.attr!=''">({{item.attr}})</span>
            </div>
            <div class='sm'>{{item.num}}份</div>
            <div class='sr'>
              <span class='small'>¥</span>{{item.price}}</div>
          </div>
        </div>
      </div>
    </div>


    <footer-submit @handleSubmit="handleSubmit" :btn-txt="btnTxt"></footer-submit>

  </div>
</template>
<script>
  import footerSubmit from '@/components/footerSubmit/footerSubmit.vue';

  import { SET_PAYMENT_OPTIONS } from '../../store/mutation-type.js';
  import { getPhysicalOrderDetail } from '@/api/index.js';

  export default {
    name: 'Order',
    props: {
      orderNo: {
        require: true
      }
    },
    data() {
      return {
        icon01: require('../../assets/dfk.png'),
        icon02: require('../../assets/y02.png'),
        icon03: require('../../assets/y03.png'),
        icon04: require('../../assets/y04.png'),
        icon05: require('../../assets/dpj.png'),
        icon06: require('../../assets/ywc.png'),
        icon07: require('../../assets/y06.png'),
        order: null,
        btnTxt:''
      };
    },
    methods: {
      handleSubmit() {
        if(this.order.status == 0){
          this.goPayment(this.order.order_no,this.order.actually_money);
        }else if(this.order.status == 4){
          this.goEvaluate(this.order.order_no)
        }else{
          this.$router.replace({
            name:'Index'
          })
        }
      },

      //去评价
      goEvaluate(orderNo) {
        this.$router.push({
          name: 'Evaluate',
          params: {
            orderNo: orderNo
          }
        })
      },

      //立即支付
      goPayment(orderNo, totalMoney) {
        this.$store.commit(SET_PAYMENT_OPTIONS, {
          canUse: false,
          orderNo: orderNo,
          totalMoney: totalMoney,
          orderType: 'OD',
          kind: 2,
        });
        this.$router.push({
          name: 'Payment'
        });
      },
    },
    mounted() {
      getPhysicalOrderDetail({
        user_id: this.$store.state.user.userid,
        order_no: this.orderNo
      }).then(res => {
        if (res.data.code == 1) {
          this.order = res.data.data;
          switch(this.order.status){
            case 0:
              this.btnTxt = "确认支付";
              break;
            case 1:
              this.btnTxt = "等待商家接单，先去首页看看";
              break;
            case 2:
              this.btnTxt = "商家已接单，先去首页看看";
              break;
            case 3:
              this.btnTxt = "订单配送中，先去首页看看";
              break;
            case 4:
              this.btnTxt = "去评价";
              break;
            case 5:
              this.btnTxt = "订单已完成！去首页看看";
              break;
            case 6:
              this.btnTxt = "订单已退款！去首页看看";
              break;
            default:
              break;
          }
        } else {
          this.feedback.Toast({
            msg: res.data.info,
            timeout: 1200
          })
        }
      })
    },
    components: {
      footerSubmit,
    }
  };

</script>
<style lang="less" scoped>
  @import './OrderDetail.less';
</style>
