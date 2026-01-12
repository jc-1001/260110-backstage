<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import sidebarLogo from '@/assets/images/common/logo-white.svg'
import sidebarDeco from '@/assets/images/common/sidebar_deco.svg'
// 其他子頁面必須包含父層路徑
const menuItems = ref([
  { name: '數據儀錶板', icon: 'insights', path: '/' },
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
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar_logo">
      <img :src="sidebarLogo" alt="UniCare品牌logo" />
    </div>
    <RouterLink v-for="item in menuItems" :key="item.name" :to="item.path" class="menu_item">
      <span class="material-icons-round menu_icon">{{ item.icon }}</span>
      <span class="menu_name">{{ item.name }}</span>
    </RouterLink>
    <!-- 管理員 -->
    <el-popover placement="bottom" trigger="hover" popper-class="admin-logout-popper">
      <div class="logout-container">
        <el-button class="logout-btn" type="danger" plain @click="handleLogout">
          <span class="material-symbols-outlined">logout</span>
          登出
        </el-button>
      </div>

      <template #reference>
        <div class="administrator">
          <span class="material-symbols-outlined">{{ adminInfo.icon }}</span>
          <span>{{ adminInfo.name }}</span>
        </div>
      </template>
    </el-popover>

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
  // width: 303px;
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

  .menu_item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 16px 24px;
    @include body1(true);
    color: $white;
    border-radius: 10px;
    transition: background 0.3s;

    &:hover,
    &.router-link-exact-active {
      color: $primaryDark;
      background: $white;
    }
  }

  .sidebar_deco {
    margin-left: -24px;
  }
}
// 管理員樣式暫時
:global(.admin-logout-popper) {
  background-color: $white !important; /* 湖水綠背景 */
  border: 1px solid #2d4d4d !important;
  border-radius: 0px !important;
  padding: 12px !important;
  justify-items: center;
}

/* 改變彈出框的小箭頭顏色 */
:global(.my-logout-popper .el-popper__arrow::before) {
  background-color: #3d6666 !important;
  border: 1px solid #3d6666 !important;
}
.administrator {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  @include body2(false);
  color: $white;
  border-top: 2px solid $grayDark;
  padding-top: 12px;
  .material-symbols-outlined {
    font-size: 30px;
    font-weight: lighter;
  }
}
</style>
