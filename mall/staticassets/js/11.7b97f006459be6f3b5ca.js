webpackJsonp([11],{GRqp:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});s("xYmq");var a=s("tJuD"),i={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"container"},[s("div",{staticClass:"rest"},[s("div",{staticClass:"tit1"},[t._v("当前余额")]),t._v(" "),s("div",{staticClass:"tit2"},[t._v(t._s(t.income.money))]),t._v(" "),0==t.isWaiter?s("router-link",{staticClass:"gopay JB",attrs:{to:{name:"MoneyWithdraw",params:{money:t.income.money}}}},[t._v("购卡充值")]):t._e(),t._v(" "),1==t.isWaiter?s("router-link",{staticClass:"gopay JB",attrs:{to:{name:"MoneyWithdraw",params:{money:t.income.money}}}},[t._v("提现")]):t._e()],1),t._v(" "),s("div",{staticClass:"come"},[s("router-link",{staticClass:"yellow",attrs:{to:{name:"MoneyStream"}}},[t._v("交易明细")]),t._v(" "),s("span",[t._v("|")]),t._v(" "),s("span",{staticClass:"yellow"},[t._v("常见问题")])],1)])},staticRenderFns:[]};var n=function(t){s("YByO")},o=s("vSla")(a.a,i,!1,n,"data-v-2cb56369",null);e.default=o.exports},YByO:function(t,e){},tJuD:function(t,e,s){"use strict";(function(t){var a=s("gyMJ");s("efG5");e.a={name:"MoneyRest",data:function(){return{host:t.host,income:Object,isWaiter:-1}},beforeCreate:function(){},created:function(){console.log("created",this.$route.params.waitid),this.$route.params.waitid>0?this.isWaiter=1:this.isWaiter=0},mounted:function(){console.log("mounted",this.host),1==this.isWaiter?this.getMoneyRest():this.isWaiter},methods:{getMoneyRest:function(){var t=this;Object(a.u)({user_id:this.$store.state.user.userid}).then(function(e){console.log("服务员的收益",e),1==e.data.code&&(t.income=e.data.data)})},getMoneyRestAll:function(){var t=this;Object(a.v)({user_id:this.$store.state.user.userid,shop_id:app.globalData.waiter_shop_id}).then(function(e){console.log("普通用户的收益",e),1==e.data.code&&(t.income=e.data.data)})}},components:{}}}).call(e,s("9AUj"))},xYmq:function(t,e,s){"use strict";(function(t){s("gyMJ"),s("efG5")}).call(e,s("9AUj"))}});
//# sourceMappingURL=11.7b97f006459be6f3b5ca.js.map