<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="文本加载失败，请重试"
    >
      <van-cell v-for="(article,index) in list" :key="index" :title="article.title"/>
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 15,
      error: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      //  1. 请求获取数据
      try {
        const { data: res } = await getSearchResult({
          page: this.page, //页码
          per_page: this.per_page, // 页面大小
          q: this.searchText //查询关键词
        })

        // 2.将数据添加到数据列表中
        const { results } = res.data
        this.list.push(...results)
        // 3.将本次加载中的loading 关闭
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          // 如果有，获取下一个数据的页码
          this.page++
        } else {
          // 如果没有，设置finished为true
          this.finished = true
        }
      } catch (error) {
        // 展示加载失败状态
        this.error = true
        thsi.loading = false
        this.$toast('请求失败，请重新尝试')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
