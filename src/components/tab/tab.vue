<template>
  <div class="mj-tab">
    <div class="mj-tab-box" :class="horizontalScroll ? 'mj-tab-nav-scoll' : 'mj-tab-nav-nomal'">
      <ul class="mj-tab-nav" ref="navbox" :style="{color: activeColor, width: width}"
        v-show="navList.length > 0">
        <li class="mj-tab-nav-item"
          v-for="item, key in navList"
          :key="key"
          :class="item._uid == activeIndex || key === activeIndex ? 'mj-tab-active' : ''"
          @click="changeHandler(item.label, item.tabkey, item._uid)">
          <a href="javascript:">{{item.label}}</a>
        </li>
      </ul>
    </div>
    <div class="mj-tab-panel">
      <slot></slot>
    </div>
  </div>
</template>
<script>

export default {
  name: 'mj-tab',
  data() {
    return {
      navList: [],
      activeIndex: this.value || 0,
      index: 0,
      width: 'auto',
      currentIndex: 0
    };
  },
  props: {
    value: Number,
    callback: Function,
    itemClick: Function,
    preventDefault: {
      type: Boolean,
      default: true
    },
    activeColor: {
      default: '#ff5e53'
    },
    horizontalScroll: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      const tabPanels = this.$children.filter(item => item.$options.name === 'mj-tab-panel');

      if (val >= tabPanels.length - 1)  val = tabPanels.length - 1;
      if (val < 0)  val = 0;

      this.activeIndex = this.index = val > tabPanels.length - 1 ? tabPanels.length - 1 : val;
      let label = '';

      tabPanels.forEach((item, key) => {
        if (val === key) {
          this.$set(item, 'isCurrent', true);
          label = item.label;
          console.log(item);
          if (item.tabkey) {
            val = item.tabkey;
          }
        } else {
          this.$set(item, 'isCurrent', false);
        }
      });
      this.callback && this.callback(label, val);
    }
  },
  methods: {
    init() {
      const tabPanels = this.$children.filter(item => item.$options.name === 'mj-tab-panel');

      this.navList = [];

      tabPanels.forEach((panel, index) => {
        this.navList.push({ _uid: panel._uid, label: panel.label, tabkey: panel.tabkey });

        if (panel.active || panel.active === 'true' || this.activeIndex === index) {
          this.activeIndex = this.index = panel._uid;
          this.currentIndex = index;
        } else {
          if (index >= tabPanels.length) {
            this.activeIndex = this.index = tabPanels[0]._uid;
          }
        }
      });

      if (this.horizontalScroll) {
        let width = 1;
        this.$nextTick(() => {
          let childArr = this.getChildNodes(this.$refs.navbox);
          childArr.forEach((item) => {
            width += item.offsetWidth;
          });
          this.width = width + 'px';
        });
      }
    },
    // 找到子菜单项
    getChildNodes(ele) {
      if (!ele) return [];

      let childArr = ele.children || ele.childNodes,
        childArrTem = [];
      for (let i = 0, len = childArr.length; i < len; i++) {
        if (childArr[i].nodeType === 1) {
          childArrTem.push(childArr[i]);
        }
      }
      return childArrTem;
    },
    //改变事件
    changeHandler(label, key, uid) {
      if (!this.preventDefault) {
        this.itemClick && this.itemClick(key);
        return;
      }

      if (this.index !== uid) {
        this.activeIndex = this.index = uid;
        this.$emit('input', key);
      }

      if (!this.value && this.value !== 0 && this.currentIndex !== key) {
        this.callback && this.callback(label, key);
      }

      this.currentIndex = key;
    }
  }
};

</script>
<style lang="less">
@import "./tab.less";

</style>
