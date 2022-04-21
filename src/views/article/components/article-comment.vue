<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error="error"
      error-text="加载失败，请重新再试"
    >
      <comment-item v-for="(item,index) in list" :key="index" :comment="item"/>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="info">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'ArticleComment',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 文章评论相关数据
      list: [],
      loading: false,
      finished: false,
      offset: null, // 请求下一页数据的页码
      totalCount: 0, // 总数据条数
      error: false
    }
  },
  created() {
    this.onLoad()
  },
  methods: {
    async onLoad() {
      try {
        // 请求获取数据
        const { data: res } = await getComments({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: 10 // 每页大小
        })

        console.log(res)
        // console.log(list)
        // 将数据添加到列表中
        const { results } = res.data

        // results.forEach(element => {
        //   this.list.push(element)
        // })
        this.list.push(...results)

        // this.list.push(...rerults)

        // 把文章评论的总数量传递到
        this.$emit('onload-success', res.data)
        //3 将loading 设置为false
        this.loading = false
        // 4判断还有没有数据
        if (results.length) {
          this.offset = res.data.last_id // 更新获取下一页数据的页码
        } else {
          this.finished = true // 没有数据了，关闭加载更多
        }
      } catch (error) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>