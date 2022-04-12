<template>
  <div class="my-container">
    <!-- 登陆以后的用户界面 -->
    <div v-if="user" class="header user-info">
      <!-- 用户信息栏 -->
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" fit="cover" round :src="userInfo.photo"/>
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <!-- 用户状态栏 -->
      <div class="data-status">
        <div class="data-item">
          <span class="count">{{userInfo.birthday}}</span>
          <span class="text">生日</span>
        </div>
        <div class="data-item">
          <span class="count">10</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">10</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">10</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 登录之前的用户界面 -->
    <div v-else class="header not-login">
      <div class="login-btn">
        <img class="mobile-img" src="~@/assets/mobile.png" @click="$router.push('/login')">
        <span class="text">登录/注销</span>
      </div>
    </div>

    <!-- 导航 grid -->
    <van-grid class="grid-container" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="mfont micon-shoucang"></i>
        <span slot="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="mfont micon-lishi"></i>
        <span slot="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 底部标签 -->
    <van-cell center title="消息通知" is-link/>
    <van-cell center title="小智同学" is-link/>
    <van-cell v-if="user" class="logout-cell" center title="退出登录" @click="onlogout" clickable/>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  data() {
    return {
      userInfo: {} //存储用户信息
    }
  },
  created() {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    onlogout() {
      // 退出提示
      // 在组件中需要使用 this.$dialog 来调用弹框组件
      this.$dialog
        .confirm({
          title: '确认退出吗？'
        })
        .then(() => {
          // on confirm
          // 确认退出：清除登录状态（容器中的 user + 本地存储中的 user）
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
          console.log('取消执行这里')
        })
    },
    // 加载用户信息
    async loadUserInfo() {
      try {
        const { data: res } = await getUserInfo()

        this.userInfo = res.data
      } catch (err) {
        this.$toast('获取数据失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png') no-repeat;
    background-size: cover;
  }
  .not-login {
    display: flex;

    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
    .mobile-img {
      width: 132px;
      height: 132px;
      margin-bottom: 15px;
    }
    .text {
      font-size: 28px;
      color: #ffffff;
    }
  }
  .user-info {
    .base-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box; //利用布局模型来控制盒子的大小

      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid #ffffff;
        }
        .name {
          font-size: 30px;
          color: #ffffff;
        }
      }
    }
    .data-status {
      // height: 130px;

      display: flex;
      .data-item {
        flex: 1;
        height: 130px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-container {
    .grid-item {
      height: 141px;
      i.mfont {
        font-size: 45px;
      }
      .micon-shoucang {
        color: #eb5253;
      }
      .micon-lishi {
        color: #ff9d1d;
      }
      span.text {
        padding-top: 10px;
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    margin-top: 10px;
    text-align: center;
    color: #eb5253;
  }
}
</style>
