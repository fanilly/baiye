webpackJsonp([15],{"0i/F":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("gyMJ"),s=(a("efG5"),a("efG5"),{name:"AdminShopCard",data:function(){return{shopInfo:{},imgs:[],imgData:{accept:"image/gif, image/jpeg, image/png, image/jpg"},accept:"image/gif,image/jpeg,image/png,image/jpg",viewImgs:"",filedata:Object}},beforeCreate:function(){},created:function(){},mounted:function(){this.getAdminIndexInfo()},methods:{getAdminIndexInfo:function(){var e=this;Object(i.j)({user_id:this.$store.state.user.userid}).then(function(t){1==t.data.code&&(e.shopInfo=t.data.data,e.viewImgs=t.data.data.banner)})},handleChooseImg:function(e){var t=e.target.files[0].type;if(console.log(this.filedata),-1!=this.accept.indexOf(t)&&""!=t){var a;e.target.dataset.index;this.viewImgs=(a=e.srcElement,window.URL.createObjectURL(a.files.item(0))),this.filedata=e.target.files[0],this.publicUploadImg()}else this.feedback.Toast({msg:"请选择正确的文件类型",icon:"error",timeout:1500})},publicUploadImg:function(e){Object(i.G)({name:"name",file:e,user_id:this.$store.state.user.userid}).then(function(e){console.log("上传图片",e),e.data.code})}},components:{}}),n={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("div",{staticClass:"container"},[a("div",{staticClass:"header"},[a("img",{attrs:{src:""!=e.viewImgs?e.viewImgs:"../images/poster.jpg"}}),e._v(" "),a("div",{staticClass:"btn"},[a("input",{staticClass:"upload",attrs:{type:"file",accept:e.accept},on:{change:e.handleChooseImg}}),e._v("更换")])]),e._v(" "),a("div",{staticClass:"main"},[a("div",{staticClass:"content"},[a("div",{staticClass:"title"},[e._v(e._s(e.shopInfo.shop_name))]),e._v(" "),a("img",{attrs:{src:e.shopInfo.qrcode}}),e._v(" "),a("div",{staticClass:"remark"},[e._v("扫码进店")])])])])])},staticRenderFns:[]};var o=a("vSla")(s,n,!1,function(e){a("HoHG")},"data-v-932fc5e2",null);t.default=o.exports},HoHG:function(e,t){}});
//# sourceMappingURL=15.0c36073a613381fc585a.js.map