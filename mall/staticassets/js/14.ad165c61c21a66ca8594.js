webpackJsonp([14],{gabR:function(t,e){},"tJD/":function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=o("IHPB"),n=o.n(a),s=o("aPD3"),i=o("gH3t"),l=o("gyMJ"),r=(o("efG5"),i.a,s.a,o("efG5"),{name:"MoneyStream",data:function(){return{typekind:0,page:1,moneyinfo:[],commentLoadedAll:!1,noCommentLists:!1,allowLoadMore:!0}},beforeCreate:function(){},created:function(){},mounted:function(){this.getMoneyStraeam()},methods:{changeType:function(t){this.typekind=t,this.page=1,this.moneyinfo=[],this.commentLoadedAll=!1,this.noCommentLists=!1,this.allowLoadMore=!0,this.getMoneyStraeam()},getMoneyStraeam:function(){var t=this;console.log(this.allowLoadMore,this.commentLoadedAll,this.noCommentLists),!this.allowLoadMore||this.commentLoadedAll||this.noCommentLists||(this.allowLoadMore=!1,Object(l.w)({user_id:this.$store.state.user.userid,page:this.page}).then(function(e){var o;console.log("收益明细",e),e.data.data.length<20&&(t.commentLoadedAll=!0),0==e.data.data.length&&0==t.moneyinfo.length&&(t.noCommentLists=!0),(o=t.moneyinfo).push.apply(o,n()(e.data.data)),t.allowLoadMore=!0,t.page++}))}},components:{scroller:i.a,LoadMore:s.a}}),d={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"container"},[o("div",{staticClass:"scrollBox"},[o("scroller",{on:{getData:t.getMoneyStraeam}},[o("div",{staticClass:"qlist"},t._l(t.moneyinfo,function(e){return o("div",{staticClass:"item  scroll-item"},[o("div",{staticClass:"fleft"},[o("div",{staticClass:"tit1"},[t._v(t._s(e.remark))]),t._v(" "),o("div",{staticClass:"tit2"},[t._v(t._s(e.create_time))])]),t._v(" "),3!=e.type?o("div",{staticClass:"fright green"},[t._v("+"+t._s(e.change_money))]):t._e(),t._v(" "),3==e.type?o("div",{staticClass:"fright red"},[t._v("-"+t._s(e.change_money))]):t._e()])})),t._v(" "),o("load-more",{attrs:{"show-loading":!t.commentLoadedAll&&!t.noCommentLists,tip:t.commentLoadedAll||t.noCommentLists?"已加载全部数据":"加载中","background-color":"#fbf9fe"}})],1)],1)])},staticRenderFns:[]};var c=o("vSla")(r,d,!1,function(t){o("gabR")},"data-v-c2ca43b0",null);e.default=c.exports}});
//# sourceMappingURL=14.ad165c61c21a66ca8594.js.map