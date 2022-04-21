<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()"/>
    <!-- /导航栏 -->
    <input type="file" hidden ref="file" @change="onFileChange">
    <!-- 个人信息 -->
    <van-cell class="avatar-cell" title="头像" is-link center @click="$refs.file.click()">
      <van-image class="avatar" round fit="cover" :src="user.photo"/>
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow=true"/>
    <van-cell title="性别" :value="user.gender===0?'男':'女'" is-link @click="isUpdateGenderShow=true"/>
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow=true"/>
    <!-- /个人信息 -->
    <!-- 编辑昵称 -->
    <van-popup v-model="isUpdateNameShow" style="height:100%;" position="bottom">
      <update-name v-if="isUpdateNameShow" @close="isUpdateNameShow=false" v-model="user.name"/>
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        v-if="isUpdateGenderShow"
        @close="isUpdateGenderShow=false"
        v-model="user.gender"
      />
    </van-popup>

    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow=false"
      />
      <!-- 生日组件要重新渲染 -->
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup v-model="isUpdatePhotoShow" style="height:100%;" position="bottom">
      <update-photo :img="img" @close="isUpdatePhotoShow=false"/>
      <!-- 生日组件要重新渲染 -->
    </van-popup>
    <!-- 编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './component/update-name'
import UpdateGender from './component/update-gender'
import UpdateBirthday from './component/update-birthday'
import UpdatePhoto from './component/update-photo'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data() {
    return {
      user: {
        // 用户个人信息
      },
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null //图片地址
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile() {
      try {
        const { data: res } = await getUserProfile()
        // console.log(res)
        this.user = res.data
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取blob数据
      this.img = window.URL.createObjectURL(file)
      //   展示弹出层
      this.isUpdatePhotoShow = true

      // file-input 如果选了同一个文件，不会出发change事件，需要清空内部的value
      this.$refs.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>