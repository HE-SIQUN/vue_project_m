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
    }

]

const router = new VueRouter({
    routes
})

export default router