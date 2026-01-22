import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 0. 後台登入 - 獨立頁面
  {
    path: '/adminlogin',
    name: 'Adminlogin',
    component: () => import('../views/LoginView.vue'),
    meta: { title: '後台登入', 
      showSideBar: false,
     }
  },
  // 1. 數據儀表板 - 獨立頁面
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/BackDashboard.vue'),
    meta: { title: '數據儀表板', 
      showSideBar: true,
    }
  },

  // 使用者管理
  {
    path: '/users',
    name: 'UserList',
    component: () => import('../views/users/UserList.vue'),
    meta: { 
      title: '使用者管理',
      showSideBar: true,}
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('../views/users/UserDetail.vue'),
    meta: { 
      title: '使用者詳情',
      showSideBar: true,}
  },

  // 商品管理
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('../views/products/ProductList.vue'),
    meta: { title: '商品管理' }
  },
  {
    // 新增模式：沒有id
    path: '/products/add', 
    name: 'productAdd',
    component: () => import('../views/products/ProductEdit.vue')
  },
  {
    // 編輯模式：有id
    path: '/products/edit/:id?',
    name: 'ProductEdit',
    component: () => import('../views/products/ProductEdit.vue'),
    meta: { title: '編輯商品' }
  },
  

  // 訂單管理
  {
    path: '/orders',
    name: 'OrderList',
    component: () => import('../views/orders/OrderList.vue'),
    meta: { title: '訂單管理' }
  },
  {
    path: '/orders/edit/:id?',
    name: 'OrderEdit',
    component: () => import('../views/orders/OrderEdit.vue'),
    meta: { title: '訂單詳情' }
  },

  // 系統通知
  {
    path: '/notices',
    name: 'NoticeList',
    component: () => import('../views/notices/NoticeList.vue'),
    meta: { title: '系統通知' }
  },
  {
    path: '/notices/edit/:id?',
    name: 'NoticeEdit',
    component: () => import('../views/notices/NoticeEdit.vue'),
    meta: { title: '編輯通知' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
// 動態變更網頁頁籤
router.beforeEach(async (to, from) => {
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} - UniCare`
  }
})

export default router