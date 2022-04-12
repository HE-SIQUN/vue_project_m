<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button class="search-btn" slot="title" type="info" size="small" round icon="search">搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 标签页 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。
         通过 animated 属性可以开启切换标签内容时的转场动画。
         通过 swipeable 属性可以开启滑动切换标签页。
    -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
        <article-list :channel="channel"></article-list>
      </van-tab>

      <div class="placeholder" slot="nav-right"></div>
      <div class="hamburger-btn" slot="nav-right">
        <i class="mfont micon-gengduo"></i>
      </div>
    </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './component/article-list'
export default {
  name: 'HomePage',
  components: {
    ArticleList
  },
  props: {},
  data() {
    return {
      active: 0,
      channels: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadChannels()
  },
  mounted() {},
  methods: {
    async loadChannels() {
      try {
        const { data: res } = await getUserChannels()

        this.channels = res.data.channels
      } catch (error) {
        this.$toast('请求失败，请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/.channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      height: 82px;
      top: 92px;
      z-index: 9999;
      left: 0;
      right: 0;
    }
    .van-tab {
      min-width: 150px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: palevioletred;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 14px;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0;
      // 不参与flex平分机制
      width: 28.5px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;
      right: 0;
      width: 66px;
      height: 82px;
      i.mfont {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
