<template>
  <van-button v-if="isFollowed" :loading="isFollowLoading" round size="small" @click="onFollow">已关注</van-button>
  <van-button
    v-else
    type="info"
    :loading="isFollowLoading"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
  >关注</van-button>
</template>
<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  data() {
    return {
      isFollowLoading: false
    }
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  created() {},
  computed: {},
  methods: {
    // 关注人函数
    async onFollow() {
      // 开启按钮的 loading 状态
      this.isFollowLoading = true

      try {
        // 如果已关注，则取消关注
        const authorId = this.userId
        if (this.isFollowed) {
          await deleteFollow(authorId)
        } else {
          // 否则添加关注
          await addFollow(authorId)
        }

        // 更新视图
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败，请重新再试'
        if (err.response && err.response === 400) {
          message = '你不能关注你自己！'
        }
        this.$toast.fail(message)
      }

      // 关闭按钮的 loading 状态
      this.isFollowLoading = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>

