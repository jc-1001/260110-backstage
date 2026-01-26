<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router' // 導入 useRouter
import sidebarLogo from '@/assets/images/common/logo-white.svg'
import sidebarDeco from '@/assets/images/common/sidebar_deco.svg'

const router = useRouter() // 定義 router

// 其他子頁面必須包含父層路徑
const menuItems = ref([
  { name: '數據儀錶板', icon: 'insights', path: '/Dashboard' },
  { name: '使用者管理', icon: 'contact_page', path: '/users' },
  { name: '商品管理', icon: 'storefront', path: '/products' },
  { name: '訂單管理', icon: 'assignment', path: '/orders' },
  { name: '系統通知', icon: 'forum', path: '/notices' },
])

// 管理員資訊
const adminInfo = ref({
  name: '管理員01',
  icon: 'account_circle',
})

// 登出功能
const handleLogout = () => {
  if (confirm('確定要登出管理系統嗎？')) {
    localStorage.removeItem('isAdminLogin') // 清除路由守衛需要的登入標記
    router.push('/') // 導回登入頁面
  }
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar_logo">
      <img :src="sidebarLogo" alt="UniCare品牌logo" />
    </div>

    <div class="menu_list">
      <RouterLink v-for="item in menuItems" :key="item.name" :to="item.path" class="menu_item">
        <span class="material-icons-round menu_icon">{{ item.icon }}</span>
        <span class="menu_name">{{ item.name }}</span>
      </RouterLink>
    </div>

    <div class="admin_section" @click="handleLogout">
      <span class="material-icons-round admin_icon">{{ adminInfo.icon }}</span>
      <span class="admin_name">{{ adminInfo.name }}</span>
      <span class="material-icons-round logout_icon">logout</span>
    </div>

    <div class="sidebar_deco">
      <img :src="sidebarDeco" alt="sidebar裝飾圖形" />
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 250px;
  height: 100vh;
  background-color: $primary;
  box-shadow: $shadow;
  border-radius: 0 20px 20px 0;
  position: sticky;
  top: 0;
  overflow: hidden;

  .sidebar_logo {
    padding-left: 24px;
    margin-bottom: 8px;
    img {
      width: 80%;
    }
  }

  .menu_list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1; // 讓選單撐開剩餘空間，把管理員擠到下面
  }

  .menu_item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 16px 24px;
    @include body1(true);
    color: $white;
    border-radius: 10px;
    transition: background 0.3s;
    text-decoration: none;

    &:hover,
    &.router-link-exact-active {
      color: $primaryDark;
      background: $white;
    }
  }

  // 管理員區塊樣式
  .admin_section {
    margin-top: auto; // 確保在最下方
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 24px;
    color: $white;
    cursor: pointer; // 滑鼠手勢
    border-radius: 10px;
    transition: background 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .logout_icon {
      margin-left: auto;
      font-size: 20px;
      opacity: 0.8;
    }
  }

  .sidebar_deco {
    margin-left: -24px;
    margin-top: 10px;
  }
}

:global(.admin-logout-popper) {
  // 保持原有樣式
}
</style>