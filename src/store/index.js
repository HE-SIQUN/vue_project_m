import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'
Vue.use(Vuex)
const Token_Key = 'TOUTIAO_USER'
    // 很多地方都用到了，所以用一个字符串去保存起来
export default new Vuex.Store({
    state: {
        user: getItem(Token_Key)
    },
    getters: {},
    mutations: {
        setUser(state, user) {
            state.user = user
            setItem(Token_Key, state.user)
                // 本地存储只能存字符串格式的。
        }
    },
    actions: {},
    modules: {}
})