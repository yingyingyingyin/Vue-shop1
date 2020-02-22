import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import '../assets/css/globla.css'
import '../assets/fonts/iconfont.css'
import Welcome from '@/components/Welcome'
import Users from '@/components/users/Users'
import Right from '@/components/rights/Right'
import Roles from '@/components/rights/Roles'
import Goods_cates from '@/components/goods/Goods_cates'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      redirect: '/welcome',
      component: Home,
      children: [{
        path: '/welcome',
        component: Welcome
      },{
        path:'/users',
        component:Users
      },
      {
        path:'/rights',
        component:Right
      },
    {
      path:'/roles',
      component:Roles
    },{
      path:'/categories',
      component:Goods_cates
    }

      ]

    }
  ]
})
//为路由对象添加  beforEach导航守卫 ，使只有登录后携带了token后才有权进入页面，否则跳转到登录页面
//to:将要去的路径  from:从哪里来的路径  next() ：放行   next('/login)：强制跳转
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next()
  } else {
    const localtoken = window.sessionStorage.getItem("token");
    //是否存在token 不存在强制跳转登录页面 存在放行
    if (!localtoken) {
      next('/login')
    } else {
      next();
    }
  }
})

export default router;
