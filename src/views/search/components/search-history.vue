<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <template v-if="isDeleteShow">
        <span @click="searchHistories = []">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </template>

      <van-icon v-else @click="isDeleteShow = true" name="delete"/>
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onHistoryClick(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onHistoryClick(item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        console.log(typeof item)
      } else {
        // 否则执行搜索操作
        this.$emit('history', item)
      }
    }
  }
}
</script>

<style scoped lang="less"></style>