/* 频道请求模块 */
import request from '@/utils/request'

/**
 * 获取文章列表
 */
export function getComments(params) {
    return request({
        method: "GET",
        url: "/v1_0/comments",
        params
    });
}

/**
 * 对评论或评论回复点赞
 */
export function addCommentLike(commentId) {
    return request({
        method: "POST",
        url: "/v1_0/comment/likings",
        data: {
            target: commentId
        }
    });
}

/**
 * 取消对评论或评论回复点赞
 */
export function deleteCommentLike(commentId) {
    return request({
        method: "DELETE",
        url: `/v1_0/comment/likings/${commentId}`
    });
}

/**
 * 添加评论或评论回复
 */
export function addComment(data) {
    return request({
        method: "POST",
        url: "/v1_0/comments",
        data
    });
}