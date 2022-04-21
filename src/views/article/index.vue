<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow @click-left="onClickLeft" title="黑马头条"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo"/>
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate|relativeTime}}</div>
          <!--利用事件参数进行传值，$event接收传上来的值 -->
          <follow-user
            :is-followed="article.is_followed"
            class="follow-btn"
            :user-id="article.aut_id"
            @update-is_followed="article.is_followed=$event"
          ></follow-user>
          <!-- <van-button
            v-if="article.is_followed"
            :loading="isFollowLoading"
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
          >已关注</van-button>
          <van-button
            v-else
            class="follow-btn"
            type="info"
            :loading="isFollowLoading"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
          >关注</van-button>-->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>

        <!-- 文章评论列表 -->

        <article-comment
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount=$event.total_count"
        />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow=true"
          >写评论</van-button>
          <van-icon name="comment-o" :info="totalCommentCount" color="#777"/>
          <collect-article v-model="article.is_collected" :article-id="article.art_id"/>
          <like-article v-model="article.attitude" :article-id="article.art_id"/>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布文章评论 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post :target="article.art_id" @posyt-comment="onPostSuccess"></comment-post>
        </van-popup>
        <!-- /发布文章评论 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus===404" class="error-wrap">
        <van-icon name="failure"/>
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure"/>
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import ArticleComment from './components/article-comment'
import CommentPost from './components/comment-post'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    ArticleComment,
    CommentPost
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, //文章详情
      loading: true, //加载中 的loading 状态
      errStatus: 0,
      totalCommentCount: 0,
      isPostShow: false,
      commentList: [] //评论列表
      // isFollowLoading:false  //展示的loading效果
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      // 重新加载，让loading 重新转起来,展示加载中
      this.loading = true
      try {
        const { data: res } = await getArticleById(this.articleId)
        // if (Math.random() > 0.5) {
        //   JSON.parse('SADASDADASDASDDADADSA')
        // }

        // 数据驱动视图这件事不是立即的
        this.article = res.data
        //  初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }
      } finally {
        this.loading = false
      }
    },
    onClickLeft() {
      this.$router.back()
    },
    previewImage() {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images,
            startPosition: index,
            closeable: true
          })
        }
      })
    },
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false

      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    }
    // // 关注人函数
    // async onFollow() {
    //   // 开启按钮的 loading 状态
    //   this.isFollowLoading = true

    //   try {
    //     // 如果已关注，则取消关注
    //     const authorId = this.article.aut_id
    //     if (this.article.is_followed) {
    //       await deleteFollow(authorId)
    //     } else {
    //       // 否则添加关注
    //       await addFollow(authorId)
    //     }

    //     // 更新视图
    //     this.article.is_followed = !this.article.is_followed
    //   } catch (err) {
    //     let message = '操作失败，请重新再试'
    //     if (err.response && err.response === 400) {
    //       message = '你不能关注你自己！'
    //     }
    //     this.$toast.fail(message)
    //   }

    //   // 关闭按钮的 loading 状态
    //   this.isFollowLoading = false
    // }
  }
}
</script>

<style scoped lang="less">
@import url('./markdown.css');
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
