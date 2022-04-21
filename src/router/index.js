import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
    // { path: '/', redirect: '/login' },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/login/index.vue')
    },
    {
        path: '/',
        redirect: '/home',
        // name: 'LayoutIndex',
        component: () =>
            import ('../views/layout/index.vue'),
        children: [{
                path: '/home', // 默认子路由
                name: 'home',
                component: () =>
                    import ('@/views/home')
            },
            {
                path: '/qa',
                name: 'qa',
                component: () =>
                    import ('@/views/qa')
            },
            {
                path: '/video',
                name: 'video',
                component: () =>
                    import ('../views/video/index.vue')

            },
            {
                path: '/my',
                name: 'my',
                component: () =>
                    import ('@/views/myfile')
            }
        ]
    },
    // 需要配置一级路由
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ('@/views/search')
    },
    {
        path: '/article/:articleId',
        name: 'article',
        component: () =>
            import ('@/views/article'),
        props: true //开启props传参，说白了就是把路由参数映射到组件的props中
    },
    {
        name: 'user-profile',
        path: '/user/profile',
        component: () =>
            import ('@/views/user-profile')
    }

]

const router = new VueRouter({
    routes
})

export default router