<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import adminNavBar from '@/components/admin/layout/adminNavBar.vue'
import AdminHeader from '@/components/admin/adminHeader.vue'

const isCollapsed = ref(false)
</script>
<template>
  <div class="admin-container">
    <adminNavBar v-if="$route.meta.showSideBar" />
    <div class="main-wrapper">
      <main class="admin-main">
        <adminHeader v-if="$route.meta.showAdminHeader" />
        <router-view />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-container {
  display: flex; // 關鍵：讓 Sidebar 和 Wrapper 左右水平排列
  min-height: 100vh;
  // width: 100vw;
  background-color: $primaryLight;
}

.main-wrapper {
  flex: 1; // 佔滿右側剩餘空間
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 24px 54px;
}

.admin-main {
  flex: 1;
  padding: 0px !important;
  overflow-y: auto;
}
</style>
