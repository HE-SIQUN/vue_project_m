<template>
  <div>
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onUpdata"
    />
    <!-- 输入栏 -->
    <div class="field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="11"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>

    <!--输入框结束  -->
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localName: this.value
    }
  },
  created() {},
  computed: {},
  methods: {
    async onUpdata() {
      try {
        const localName = this.localName.trim()
        if (!localName.length) {
          this.$toast('昵称不能为空')
          return
        }
        await updateUserProfile({
          name: localName
        })
        //   更新视图
        this.$emit('input', localName)
        //  关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.field-wrap {
  padding: 10px;
}
</style>
