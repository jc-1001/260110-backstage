<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import sidebarLogo from '@/assets/images/common/logo.svg'
import sidebarDeco from '@/assets/images/common/sidebar_deco.svg'

const menuItems = ref([
  { name: '首頁戰情室', icon: 'dashboard', path: '/HomeView' },
  { name: '飲食日記', icon: 'restaurant', path: '/DietLog' },
  { name: '數位藥箱', icon: 'medication', path: '/medicine' },
  { name: '身體數值中心', icon: 'bar_chart', path: '/Metrics' },
  { name: '樂活商城', icon: 'storefront', path: '/shop' },
  { name: '幫助中心', icon: 'help', path: '/' },
])
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
  background-color: $white;
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
    color: $primaryDark;
    border-radius: 10px;
    transition: background 0.3s;

    &:hover,
    &.router-link-active {
      color: $white;
      background: $linear2;
    }
  }

  .sidebar_deco {
    margin-left: -24px;
  }
}
</style>
