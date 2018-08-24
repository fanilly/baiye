<template>
  <div class="container">
    <section class="input-box">
      <input type="text" v-model="userName" placeholder="收货人姓名">
    </section>
    <section class="input-box">
      <input type="text" v-model="userPhone" placeholder="手机号码">
    </section>
    <section class="input-box">
      <x-address title="" v-model="value" :list="addressData" @on-shadow-change="onShadowChange" :inline-desc="inlineDesc" :show.sync="showAddress"></x-address>
      <img :src="arrowIcon" class="arrow" alt="">
    </section>
    <section class="input-box">
      <input type="text" v-model="addressInfo" placeholder="请填写详细地址,小区门牌号">
    </section>
    <section class="input-box">
      <input type="text" v-model="addressTags" placeholder="请输入标签">
    </section>
    <section class="switch-box">
      <h2>是否设为默认地址</h2>
      <inline-x-switch v-model="isDefault"></inline-x-switch>
    </section>
    <footer-submit @handleSubmit="handleSubmit" btn-txt="确定"></footer-submit>
  </div>
</template>
<script>
  import footerSubmit from '@/components/footerSubmit/footerSubmit.vue';
  import { addOrChangeAddress, getAddress } from '@/api/index.js';
  import { XAddress, ChinaAddressV4Data, InlineXSwitch } from 'vux'

  export default {
    name: 'AddressAdd',
    props:{
      id:{
        require: true
      }
    },
    data() {
      return {
        arrowIcon: require('../../assets/return.png'),
        userName:'',
        userPhone:'',
        addressInfo:'',
        addressTags:'',
        isDefault:false,
        value: [],
        ids:[],
        addressData: ChinaAddressV4Data,
        showAddress: false,
        inlineDesc:'请选择地址'
      };
    },
    methods: {
      //选择地址
      onShadowChange (ids, names) {
        console.log(this.value)
        if(ids || names) {
          this.ids = ids;
          this.inlineDesc = names.join(' ');
        }
      },

      //点击确定
      handleSubmit(){
        let formData = {
          user_name: this.userName,
          user_phone: this.userPhone,
          city: this.ids[this.ids.length-1],
          user_address:this.addressInfo,
          isdefault: this.isDefault ? 1 : 0,
          detailInfo:this.addressTags,
          aid: this.id == 'newaddress' ? 0 : this.id,
          uid: this.$store.state.user.userid
        };
        addOrChangeAddress(formData).then(res=>{
          this.feedback.Toast({
            msg: res.data.info,
            timeout: 1200
          });
          if(res.data.code == 1){
            setTimeout(()=>{
              this.$router.go(-1)
            }, 800)
          }
        })
      }
    },
    mounted() {
      if(this.id != 'newaddress'){
        document.title = '修改地址';
        getAddress({
          uid:this.$store.state.user.userid,
          address_id: this.id
        }).then(res=>{
          if(res.data.code == 1){
            let resData = res.data.data[0];
            this.userName = resData.user_name;
            this.userPhone = resData.user_phone;
            this.addressInfo = resData.user_address;
            this.addressTags = resData.detailInfo;
            this.isDefault = resData.isdefault == 1;
            this.value = [resData.city.province.id+"",resData.city.city.id+"",resData.city.area.id+""];
          }else{
            this.feedback.Toast({
              msg: res.data.info,
              timeout: 1200
            })
          }
        })
      }
    },
    components:{
      XAddress,
      InlineXSwitch,
      footerSubmit
    }
  };

</script>
<style lang="less" scoped>
  @import './Address.less';
  .container {
    padding: 0;
  }
</style>
