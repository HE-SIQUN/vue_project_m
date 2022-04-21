/**
 * 用户相关的请求模块
 */
import request from "../utils/request"


/* 用户登录 */
export const login = data => {
        return request({
            method: 'POST',
            url: '/v1_0/authorizations',
            data
        })
    }
    /* 短信验证码 */
export const sendSms = mobile => {
        return request({
            method: 'GET',
            url: `/v1_0/sms/codes/${mobile}`,

        })
    }
    /**
     * 获取用户自己的信息
     */
export const getUserInfo = () => {
        return request({
            method: 'GET',
            url: '/v1_0/user/profile',
            // 发送请求头数据

        })
    }
    /* 获取用户列表信息 */
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/channels'
    })
}

/**
 * 添加关注
 */
export const addFollow = userId => {
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        data: {
            target: userId
        }
    })
}

/**
 * 取消关注
 */
export const deleteFollow = userId => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${userId}`
    })
}


/**
 * 获取当前登录用户的个人资料 /v1_0/user/profile
 */
export const getUserProfile = target => {
    return request({
        method: 'GET',
        url: "/v1_0/user/profile"
    })
}


/**
 * 更新用户资料
 */
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: "/v1_0/user/profile",
        data
    })
}

/**
 * 更新用户头像
 */
export function updateUserPhoto(data) {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/photo',
        data
    })
}