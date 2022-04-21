<template>
  <div class="channel-edit">
    <van-cell class="title-text" title="我的频道" :border="false">
      <van-button
        size="small"
        round
        type="danger"
        plain
        class="edit-button"
        @click="isedit=!isedit"
      >{{isedit?'完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel,index) in myChannels"
        :key="index"
        :text="channel.name"
        @click="onMyChannelClick(channel,index)"
      >
        <!-- 自定义元素插槽才能用v-if v-else -->
        <van-icon slot="icon" name="close" v-show="isedit &&!fixChannels.includes(index)"></van-icon>
        <span class="text" slot="text" :class="{active:index===active}">{{channel.name}}</span>
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐区域 -->
    <van-cell class="title-text" title="频道推荐" :border="false"></van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel,index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        @click="onAddChannels(channel)"
      />
    </van-grid>
    <!-- 频道推荐区域结束-->
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allchannels: [],
      isedit: false, //控制编辑按钮图标的显示
      fixChannels: [0] // 固定数组，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels() {
      //   filter的方法，遍历数组，把符合条件的元素存储到新的数组中并返回
      return this.allchannels.filter(channel => {
        // find方法，遍历数组，将符合条件的第一个元素返回
        return !this.myChannels.find(mychannel => mychannel.id === channel.id)
      })

      //   const channels = []
      //   this.allchannels.forEach(channel => {
      //     const ret = this.myChannels.find(
      //       mychannel => mychannel.id === channel.id
      //     )
      //     //   如果不包括的话，就放入推荐的列表
      //     if (!ret) {
      //       channels.push(channel)
      //     }
      //   })
      //   return channels
    }
  },
  watch: {},
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const { data: res } = await getAllChannels()
        this.allchannels = res.data.channels
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },

    async onAddChannels(channel) {
      this.myChannels.push(channel)
      try {
        if (this.user) {
          // 已登录，数据存储到线上
          await addUserChannel([
            {
              id: channel.id, // 频道 id
              seq: this.myChannels.length // 频道的 序号
            }
          ])
        } else {
          // 未登录，数据存储到本地存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('添加频道失败')
      }
    },

    onMyChannelClick(channel, index) {
      if (this.isedit) {
        //  编辑状态，删除内容
        // 如果是固定频道，不删除
        if (this.fixChannels.includes(index)) {
          return
        }
        // 会产生 active错位的情况 利用if来判断
        // 2.删除频道项
        this.myChannels.splice(index, 1)
        // 3.删除后，更新激活的频道项目
        if (index <= this.active) this.$emit('change-active', this.active - 1)
        // 4.处理持久化
        this.deleteChannel(channel)
      } else {
        // 切换状态，将本地的索引传给上方
        this.$emit('change-active', index, false)
      }
    },
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录,更新到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，先直接存入，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (error) {}
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-style: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 28px;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        white-space: nowrap;
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-grid-item__content {
        white-space: nowrap;
      }
      .van-icon-close {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
}
</style>
