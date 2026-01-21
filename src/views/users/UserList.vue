<script setup>

import AdminHeader from '@/components/admin/adminHeader.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. 模擬使用者資料
const users = ref([
  { id: 1, name: '王小明', email: 'ming@example.com', createdAt: '2024-03-20 14:30', status: 'active' },
  { id: 2, name: '李阿姨', email: 'lee_aunt@mail.com', createdAt: '2024-03-21 09:15', status: 'inactive' },
  { id: 3, name: '張大華', email: 'zhang888@example.com', createdAt: '2024-03-22 11:00', status: 'active' },
  { id: 4, name: '陳美玲', email: 'meiling.chen@mail.com', createdAt: '2024-03-22 16:45', status: 'active' },
  { id: 5, name: '林小強', email: 'strong_lin@mail.com', createdAt: '2024-03-23 10:20', status: 'active' },
  { id: 6, name: '趙先生', email: 'zhao_sir@example.com', createdAt: '2024-03-24 13:10', status: 'inactive' },
])

// 2. 搜尋邏輯
const searchQuery = ref('')

// 先根據搜尋關鍵字過濾
const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return users.value
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) || 
    user.email.toLowerCase().includes(query)
  )
})

// 3. 分頁邏輯
const currentPage = ref(1)
const itemsPerPage = 5 

const totalPages = computed(() => {
  const count = Math.ceil(filteredUsers.value.length / itemsPerPage)
  return count > 0 ? count : 1
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

// 4. 跳轉邏輯
const goToUpdate = (userId) => {

  router.push({ name: 'UserDetail', params: { id: userId } })
}

// 監控搜尋輸入，當搜尋時自動回第一頁
const handleSearch = () => {
  currentPage.value = 1
}

</script>
<template>
  <div class="admin-users-page">
    <div class="page-header">
      <h2>帳號管理</h2>
      
      <div class="search-wrapper">
        <span class="material-symbols-rounded search-icon"></span>
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch"
          placeholder="搜尋姓名或電子郵件..." 
          class="search-input"
        >
      </div>
    </div>

    <div class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th class="col-name">姓名</th>
            <th class="col-email">電子郵件</th>
            <th class="col-status">帳號狀態</th>
            <th class="col-time">帳號建立時間</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="5" class="no-data">找不到相符的使用者</td>
          </tr>
          
          <tr 
            v-for="user in paginatedUsers" 
            :key="user.id" 
            class="clickable-row"
            @click="goToUpdate(user.id)"
          >
            <td class="col-name">{{ user.name }}</td>
            <td class="col-email">{{ user.email }}</td>
            <td class="col-status">
              <span :class="['status-badge', user.status]">
                {{ user.status === 'active' ? '啟用中' : '停用中' }}
              </span>
            </td>
            <td class="col-time">{{ user.createdAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-bar" v-if="filteredUsers.length > 0">
      <button 
        :disabled="currentPage === 1" 
        @click="currentPage--" 
        class="page-btn"
      >
        <span class="material-symbols-rounded"><</span>
      </button>

      <div class="page-numbers">
        <button 
          v-for="page in totalPages" 
          :key="page" 
          @click="currentPage = page"
          :class="['num-btn', { 'active': currentPage === page }]"
        >
          {{ page }}
        </button>
      </div>

      <button 
        :disabled="currentPage === totalPages" 
        @click="currentPage++" 
        class="page-btn"
      >
        <span class="material-symbols-rounded">></span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-users-page {
  padding: 30px;
  background-color: #f8fbfb;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  h2 { color: #2E6669; font-size: 24px; }
}

/* 搜尋列 */
.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 300px;
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
    font-size: 20px;
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    padding: 10px 15px 10px 40px;
    border: 1px solid #ddd;
    border-radius: 50px;
    font-size: 14px;
    &:focus {
      border-color: #2E6669;
      box-shadow: 0 0 0 3px rgba(46, 102, 105, 0.1);
      outline: none;
    }
  }
}

/* 表格容器 */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th {
    background-color: #2E6669;
    color: white;
    padding: 16px;
    text-align: left;
    font-weight: 600;
  }

  td {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    color: #444;
    vertical-align: middle;
  }

  /* 欄位寬度設定 */
  .col-name { width: 20%; }
  .col-email { width: 35%; }
  .col-status { width: 20%; text-align: center; }
  .col-time { width: 25%; }

  .clickable-row {
    cursor: pointer;
    &:hover { background-color: #f9fdfd; }
  }

  .no-data {
    text-align: center;
    padding: 40px;
    color: #999;
  }
}

/* 狀態標籤 */
.status-badge {
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  &.active { background: #E8F5E9; color: #2E7D32; }
  &.inactive { background: #FFEBEE; color: #C62828; }
}

/* 分頁換頁 Bar */
.pagination-bar {
  display: flex;
  justify-content: flex-end; /* 靠右顯示 */
  align-items: center;
  margin-top: 30px;
  gap: 12px;

  .page-btn {
    background: white;
    border: 1px solid #ddd;
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    &:disabled { opacity: 0.4; cursor: not-allowed; }
    &:hover:not(:disabled) { border-color: #2E6669; color: #2E6669; }
  }

  .page-numbers {
    display: flex; gap: 8px;
    .num-btn {
      width: 36px; height: 36px; border-radius: 8px;
      border: 1px solid #ddd; background: white; cursor: pointer;
      &.active { background: #2E6669; color: white; border-color: #2E6669; }
      &:hover:not(.active) { border-color: #2E6669; }
    }
  }
}

@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 15px; }
  .search-wrapper { max-width: 100%; }
}
</style>
