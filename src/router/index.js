import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_Welcome" */ '../components//Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_Welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/users/Users.vue')
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/Role.vue')

const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')

const List = () => import(/* webpackChunkName: "list_add" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "list_add" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/categories',
      component: Cate
    }, {
      path: '/params',
      component: Params
    }, {
      path: '/goods',
      component: List
    }, {
      path: '/goods/add',
      component: Add
    }, {
      path: '/orders',
      component: Order
    }, {
      path: '/reports',
      component: Report
    }]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由守卫
router.beforeEach((to, form, next) => {
  // to 将要访问的地址
  // form 代表哪个路径跳转而来
  // next() 放行    next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

// 防止重复路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
