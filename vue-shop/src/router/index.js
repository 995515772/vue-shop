import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Categories from '../components/categories/Categories.vue'
import Params from '../components/params/Params.vue'
import Goods from '../components/goods/Goods.vue'
import Add from '../components/goods/Add.vue'
import Orders from '../components/orders/Orders.vue'
import Reports from '../components/reports/Reports.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
				{ path: '/rights', component: Rights },
				{ path: '/roles', component: Roles },
				{ path: '/categories', component: Categories },
				{ path: '/params', component: Params },
				{ path: '/goods', component: Goods },
				{ path: '/goods/add', component: Add },
				{ path: '/orders', component: Orders },
				{ path: '/reports', component: Reports }
				
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
