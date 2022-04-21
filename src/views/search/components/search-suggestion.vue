<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text,index) in suggestions"
      :key="index"
      @click="$emit('search',text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
// 按需加载，只会把使用到的打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: []
    }
  },
  computed: {},
  watch: {
    // 当searchText发生改变的时候，就会调用handler函数
    // handler函数的名称时固定的，不能乱改
    // debounce 函数
    // 参数1：函数，不能使用箭头函数，否则this指向不确定
    // 参数2：防抖时间
    // 返回值：防抖之后的函数，和参数1功能是一样的
    searchText: {
      handler: debounce(function(value) {
        this.loadSearchSuggestions(value)
      }, 300),
      immediate: true //该回调将会在侦听开始之后被立即调用
    }
  },
  created() {},
  mounted() {},
  methods: {
    //   /searchContent/ 正则表达式中的一切内容都会当做字符串使用
    // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
    // RegExp 是原生 JavaScript 的内置构造函数
    // 参数1：字符串，注意，这里不要加 //
    async loadSearchSuggestions(q) {
      try {
        const { data: res } = await getSearchSuggestion(q)

        this.suggestions = res.data.options
        console.log(res)
        console.log(this.suggestions)
      } catch (error) {
        this.$toast('获取数据失败')
      }
    },
    highlight(text) {
      const highLight = `<span class="active">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')

      return text.replace(reg, highLight)
      //   replace会返回一个新的字符串。
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/span.active {
    color: #3296fa !important ;
  }
}
</style>