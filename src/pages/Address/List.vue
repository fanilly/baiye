<template>
  <div class="container">

    <section class="address" v-for="item,index in lists" @click.stop="handleChooseAddress(item)">
      <img class="coordinate" :src="coordinateIcon">
      <div class="content">
        <h2>{{item.user_name}} <span>{{item.user_phone}}</span></h2>
        <p>{{item.user_address}}<span v-if="item.isdefault == 1">默认</span></p>
      </div>
      <div class="rside">
        <img class="edit" :src="editIcon" alt="" @click.stop="handleAddOrEditAddress(item.aid)">
        <img class="del" :src="delIcon" alt="" @click.stop="handleDelAddress(item.aid)">
      </div>
    </section>

    <footer-submit @handleSubmit="handleAddOrEditAddress" btn-txt="点击添加新地址"></footer-submit>
  </div>
</template>
<script>
  import footerSubmit from '@/components/footerSubmit/footerSubmit.vue';
  import { LoadMore } from 'vux';
  import { getAddressLists, deleteAddress, changeAddress } from '@/api/index.js';

  export default {
    name: 'AddressList',
    data() {
      return {
        lists:[],
        coordinateIcon: require('../../assets/takeout06.png'),
        editIcon: require('../../assets/takeout08.png'),
        delIcon: require('../../assets/delite.png'),
        loaded:false,
      };
    },
    methods: {
      //添加或编辑地址
      handleAddOrEditAddress(id){
        let options = {
          name:'AddressAdd',
          params:{
            id: id ? id : 'newaddress'
          }
        };
        this.$router.push(options)
      },

      //删除地址
      handleDelAddress(id){
        this.feedback.Confirm({
          title: '',
          msg: '确认删除？',
          options: [{
            txt: '取消',
            color: '#999'
          }, {
            txt: '确定',
            color: '#0bb20c',
            callback: () => {
              deleteAddress({
                aid: id,
                uid: this.$store.state.user.userid
              }).then(res=>{
                this.feedback.Toast({
                  msg: res.data.info,
                  timeout: 1200
                });
                if(res.data.code == 1) location.reload();
              });
            }
          }]
        });
      },



      //选择地址
      handleChooseAddress(address){
        this.feedback.Loading.open('选择中');
        changeAddress({
          user_phone: address.user_phone,
          user_name: address.user_name,
          user_address: address.user_address,
          user_province: address.city.province.name,
          user_city: address.city.city.name,
          user_country: address.city.area.name,
          zip_code: address.postalCode,
          user_id: this.$store.state.user.userid
        }).then(resData=>{
          console.log(resData)
          this.feedback.Loading.close();
          if(resData.data.code == 1){
            this.$router.go(-1);
          }
        });
      }
    },
    mounted() {
      getAddressLists({
        uid:this.$store.state.user.userid
      }).then(res => {
        console.log(res)
        this.lists = res.data.data;
        this.loaded = true;
      });
    },
    components: {
      LoadMore,
      footerSubmit
    }
  };

</script>
<style lang="less" scoped>
  @import './Address.less';

</style>
