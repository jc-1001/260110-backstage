<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 存放所有從 LocalStorage 讀取的使用者
const users = ref([]);
// 搜尋關鍵字
const searchQuery = ref('');

// 1. 頁面載入時，從 LocalStorage 抓取 allUsers 陣列
onMounted(() => {
  const data = localStorage.getItem('allUsers');
  if (data) {
    users.value = JSON.parse(data);
  }
});

// 2. 搜尋過濾邏輯
const filteredUsers = computed(() => {
  return users.value.filter(user => 
    user.full_name.includes(searchQuery.value) || 
    user.email.includes(searchQuery.value)
  );
});

// 3. 跳轉至詳細資料頁
const viewDetail = (userId) => {
  router.push(`/admin/user-detail/${userId}`);
};

// 4. 刪除使用者 (選配功能，同步更新 LocalStorage)
const deleteUser = (userId) => {
  if (confirm('確定要刪除此使用者嗎？')) {
    users.value = users.value.filter(u => u.id !== userId);
    localStorage.setItem('allUsers', JSON.stringify(users.value));
  }
};
</script>

<template>
  <div class="admin-container">
    <header class="admin-header">
      <h2>使用者管理系統</h2>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜尋姓名或 Email..."
        >
      </div>
    </header>

    <div class="table-wrapper">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>電子信箱</th>
            <th>電話</th>
            <th>註冊日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ String(user.id).slice(-6) }}</td> <td>{{ user.full_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone_number || '未填寫' }}</td>
            <td>{{ user.birth_date || 'N/A' }}</td>
            <td class="actions">
              <button @click="viewDetail(user.id)" class="btn-detail">查看詳情</button>
              <button @click="deleteUser(user.id)" class="btn-delete">刪除</button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="6" class="no-data">目前沒有符合的使用者資料</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$primary-teal: #2E6669;

.admin-container {
  padding: 30px;
  background: #fdfdfd;
  min-height: 80vh;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  
  h2 { color: $primary-teal; }
  
  .search-bar input {
    padding: 8px 15px;
    border: 1px solid #ddd;
    border-radius: 20px;
    width: 250px;
    outline: none;
    &:focus { border-color: $primary-teal; }
  }
}

.table-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background: #f8f9fa;
    color: #666;
    font-weight: 600;
  }

  tr:hover { background: #fcfcfc; }

  .no-data { text-align: center; padding: 40px; color: #999; }
}

.actions {
  display: flex;
  gap: 10px;
  
  button {
    padding: 6px 12px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    transition: 0.2s;
  }
  
  .btn-detail {
    background: $primary-teal;
    color: white;
    &:hover { background: darken($primary-teal, 5%); }
  }
  
  .btn-delete {
    background: #ffeded;
    color: #d9534f;
    &:hover { background: #d9534f; color: white; }
  }
}

/* 480px 以下響應式微調 */
@media (max-width: 480px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    .search-bar input { width: 100%; }
  }
  .user-table th:nth-child(4), .user-table td:nth-child(4) { display: none; } // 隱藏電話節省空間
}
</style>