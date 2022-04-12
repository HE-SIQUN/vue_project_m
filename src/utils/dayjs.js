import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

// 全局过滤器：处理相对时间,相当于全局可用的方法，在模板中使用
// 过滤器的返回值会渲染到使用过滤器的模板位置
// {{表达式|过滤器名称}} 管道符前面的表达式的结果会作为参数传递到过滤器函数中
Vue.filter('relativeTime', value => {
    return dayjs().to(dayjs(value))
})