<template>
  <div class="update-photo">
    <img class="img" :src="img" alt ref="img">
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>
<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto, updateUserProfile } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return {
      cropper: null
    }
  },
  created() {},
  computed: {},

  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    onConfirm() {
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        // updateUserPhoto({
        //   photo: blob
        // })
        // 根据接口来去判断提供formdata对象与否
        const formData = new FormData()
        formData.append('photo', blob)

        const { data: res } = await updateUserPhoto(formData)
        // 关闭弹出层
        this.$emit('close')
        // 更新视图
        this.$emit('update-photo', res.photo)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
