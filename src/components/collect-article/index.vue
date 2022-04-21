<template>
  <div class="collect-article">
    <van-icon
      :color="value?'#ffa500':'#777'"
      :name="value?'star':'star-o'"
      @click="onCollect"
      :loading="isLoading"
    />
  </div>
</template>
<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  data() {
    return {
      isLoading: false
    }
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  created() {},
  computed: {},
  methods: {
    async onCollect() {
      this.isLoading = true
      try {
        if (this.value) {
          //  已收藏，取消受篡改
          await deleteCollect(this.articleId)
        } else {
          await addCollect(this.articleId)
        }

        // 更新视图
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (error) {
        this.$toast.fail('操作失败，请重试')
      }

      this.isLoading = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
