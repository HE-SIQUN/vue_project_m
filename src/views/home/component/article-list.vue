<template>
  <div class="article-list">
    <van-pull-refresh v-model="isreFreshLoading" @refresh="onRefresh" :success-text="refreshText">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
      >
        <!-- 子组件还需要修改，所以用了sync -->
        <article-item v-for="(article,index) in list" :key="index" :article="article"/>

        <!-- key只支持字符串的类型 -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleList } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
      // 如果没传就会报错，在子组件中接收
    }
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页的数据的时间戳，否则会一直加载同一页的数据
      error: false, //错误数据判断
      isreFreshLoading: false, //控制下拉菜单的状态
      refreshText: '刷新成功' //会变成更新了多少条的数据
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data: res } = await getArticleList({
          channel_id: this.channel.id, // 频道 id
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        const { results } = res.data

        // 2. 把请求结果数据放到 list 数组中,动态加载的，不要直接赋值，会覆盖。
        //   同时，利用扩展运算符，可以把数组打开放入
        this.list.push(...results)

        // 3. 本次数据加载结束之后要把加载状态设置为结束
        //     loading 关闭以后才能触发下一次的加载更多,此时会根据列表滚动位置判断是否触发load事件（列表内容不足一屏幕时，会直接触发）
        this.loading = false
        // 4. 判断数据是否全部加载完成
        // 如果没有数据了，把 finished 设置为 true，之后不再触发加载更多
        if (results.length) {
          this.timestamp = res.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (error) {
        this.error = true
      }
    },
    async onRefresh() {
      try {
        // 1. 请求获取数据
        const { data: res } = await getArticleList({
          channel_id: this.channel.id, // 频道 id
          timestamp: Date.now(), // 下拉刷新，每次获取最新的数据
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        const { results } = res.data
        //2. 将数据追加到列表的顶部
        this.list.unshift(...results)
        this.refreshText = `更新了${results.length}条数据`
        // 关闭下拉刷新的loading状态
        this.isreFreshLoading = false
      } catch (error) {
        this.refreshText = '请求失败'
        this.isreFreshLoading = false
        // 不改成false的话 loading 会一直转
      }
      // 请求获取数据
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>