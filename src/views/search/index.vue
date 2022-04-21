<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow=false"
      />
    </form>
    <!-- 搜索栏结束 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText"/>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch"/>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <search-history v-else :searchHistories="searchHistories" @history="onSearch"/>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data() {
    return {
      searchText: '',
      isResultShow: false, //控制搜索结果的展示
      searchHistories: getItem('serach-histories') || [] //存储历史记录
    }
  },
  computed: {},
  watch: {
    // 放到监听函数中，有变化就保存
    searchHistories(val) {
      // 同步到本地存储
      setItem('serach-histories', val)
    }
  },
  created() {},
  methods: {
    onSearch(val) {
      //为了在点击之后文本框内还有文字
      this.searchText = val

      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      // 如果index不为-1就不在前面了
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)

      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
