<template>
  <div class="like-article">
    <van-icon
      :color="value===1?'#e5645f':'#777'"
      :name="value===1?'good-job':'good-job-o'"
      @click="onLike"
      :loading="isLoading"
    />
  </div>
</template>
<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  data() {
    return {
      isLoading: false
    }
  },
  props: {
    value: {
      type: Number,
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
    async onLike() {
      console.log(this.articleId)
      console.log(this.value)
      this.isLoading = true
      try {
        let status = -1
        if (this.value === 1) {
          //  已收藏，取消受篡改
          await deleteLike(this.articleId)
        } else {
          await addLike(this.articleId)
          status = 1
        }

        // 更新视图
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '收藏成功' : '取消收藏')
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
