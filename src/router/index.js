import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 1. 數據儀表板 - 獨立頁面
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/BackDashboard.vue'),
    // meta: { showAdminHeader: true, title: '數據儀表板' }
  },

  // 2-3. 使用者管理
  {
    path: '/users',
    name: 'UserList',
    component: () => import('../views/users/UserList.vue'),
    // meta: { showAdminHeader: true, title: '使用者管理' }
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('../views/users/UserDetail.vue'),
    // meta: { showAdminHeader: true, title: '使用者詳情' }
  },

  // 4-5. 商品管理
  {
    path: '/products',
    name: 'ProductList',
    component: () => import('../views/products/ProductList.vue'),
    // meta: { showAdminHeader: true, title: '商品管理' }
  },
  {
    path: '/products/edit/:id?',
    name: 'ProductEdit',
    component: () => import('../views/products/ProductEdit.vue'),
    // meta: { showAdminHeader: true, title: '編輯商品' }
  },

  // 6-7. 訂單管理
  {
    path: '/orders',
    name: 'OrderList',
    component: () => import('../views/orders/OrderList.vue'),
    // meta: { showAdminHeader: true, title: '訂單管理' }
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('../views/orders/OrderDetail.vue'),
    // meta: { showAdminHeader: true, title: '訂單詳情' }
  },

  // 8-9. 系統通知
  {
    path: '/notices',
    name: 'NoticeList',
    component: () => import('../views/notices/NoticeList.vue'),
    // meta: { showAdminHeader: true, title: '系統通知' }
  },
  {
    path: '/notices/edit/:id?',
    name: 'NoticeEdit',
    component: () => import('../views/notices/NoticeEdit.vue'),
    // meta: { showAdminHeader: true, title: '編輯通知' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router