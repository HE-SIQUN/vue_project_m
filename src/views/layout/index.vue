<template>
  <div class="layout-container">
    <!-- 路由出口 -->
    <router-view/>
    <!-- 路由出口 -->
    <!-- 标签导航栏 -->
    <!--
      route: 开启路由模式
    -->
    <van-tabbar class="layout-tabbar" route>
      <!-- 自己的容器也加一个类名，方便控制 -->
      <van-tabbar-item to="/home">
        <i slot="icon" class="mfont micon-shouye"></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <i slot="icon" class="mfont micon-wenda"></i>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <i slot="icon" class="mfont micon-shipin"></i>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <i slot="icon" class="mfont micon-wode"></i>
        <span class="text">{{$store.state.user?'我的':'未登录'}}</span>
      </van-tabbar-item>
    </van-tabbar>
    <!-- /标签导航栏 -->
  </div>
</template>
<script>
export default {
  name: 'LayoutIndex',
  data() {
    return {}
  },
  created() {},
  computed: {},
  methods: {}
}
</script>
<style lang="less" scoped>
.layout-container {
  .layout-tabbar {
    i.mfont {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
