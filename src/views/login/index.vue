<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()"/>
    </van-nav-bar>
    <!-- 上 导航栏 -->
    <!-- 
      表单验证
      1.给van-field组件配置rules验证规则
      2.当表单提交的时候自动出发表单验证事件
         验证通过，提交事件
         不通过，不会触发submit
    -->
    <van-form ref="loginFormRules" @submit="onSubmit">
      <!-- 如果加入i标签就不能使用单标签闭合了 -->
      <!-- 验证规则单独拿出来写 -->
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRuels.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="mfont micon-shouji"></i>
      </van-field>

      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRuels.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="mfont micon-yanzhengma"></i>

        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            slot="button"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            type="default"
            native-type="button"
            @click="onSendSms"
          >发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import router from '@/router'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '13002239263', // 手机号
        code: '' // 验证码
      },
      userFormRuels: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      // 判断是否显示倒计时组件
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      // 1. 获取表单数据
      const user = this.user

      // TODO: 2. 表单验证
      this.$toast.loading({
        message: '登陆中...',
        forbidClick: true, //禁用背景点击
        duration: 0 // 持续时间，默认是2000 改为0就是持续进行
      })
      // 3. 提交表单请求登录
      try {
        const { data: res } = await login(user)
        this.$store.commit('setUser', res.data)
        this.$toast.success('登录成功')
        // 登录成功跳转回去
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误')
        } else {
          console.log('登录失败，请稍后重试', err)
          this.$toast.fail('登录失败，请稍后重试')
        }
      }

      // 4. 根据请求响应结果处理后续操作
    },
    async onSendSms() {
      // 1.验证是否真的输入了手机号
      try {
        await this.$refs.loginFormRules.validate('mobile')
        // 通过validate去单独校验一个表单的验证，返回一个promise。
      } catch (error) {
        return console.log('验证失败', error)
        //  让下面的语句不要继续执行了
      }
      // 2.显示倒计时
      this.isCountDownShow = true
      // 3.向后台请求数据
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        // 这个是如果没有发送成功的话，那么我们直接关闭倒计时。
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .mfont {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
  .van-field__button {
    border: 5px solid black;
  }
}
</style>