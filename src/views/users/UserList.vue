<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const users = ref([]);
const searchQuery = ref('');

// 載入資料
onMounted(() => {
  const data = localStorage.getItem('allUsers');
  if (data) {
    users.value = JSON.parse(data);
  }
});

// 搜尋過濾
const filteredUsers = computed(() => {
  return users.value.filter(user => 
    user.full_name.includes(searchQuery.value) || 
    user.email.includes(searchQuery.value)
  );
});

// 跳轉詳情
const viewDetail = (userId) => {
  router.push(`/admin/user-detail/${userId}`);
};

// 刪除使用者
const deleteUser = (userId) => {
  if (confirm('確定要刪除此使用者嗎？')) {
    users.value = users.value.filter(u => u.id !== userId);
    localStorage.setItem('allUsers', JSON.stringify(users.value));
  }
};

</script>

<template>
  <div class="admin-user-list">
    <header class="admin-header">
      <div class="title-section">
        <h2>使用者管理系統</h2>
        <span class="user-count">共 {{ users.length }} 位會員</span>
      </div>
      
      <div class="action-section">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜尋姓名或 Email..."
          class="search-input"
        >
      </div>
    </header>

    <div class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>會員編號</th>
            <th>姓名</th>
            <th>電子信箱</th>
            <th>聯絡電話</th>
            <th>帳號狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="id-cell">{{ user.member_id }}</td>
            <td class="name-cell">{{ user.full_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone_number || '未填寫' }}</td>
            <td class="actions">
              <button @click="viewDetail(user.id)" class="btn-detail">查看詳情</button>
              <button @click="deleteUser(user.id)" class="btn-delete">刪除</button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="empty-state">目前尚無使用者資料</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$primary-teal: #2E6669;
$border-color: #e0e0e0;

.admin-user-list {
  padding: 40px;
  min-width: 1024px; // 強制最小寬度，防止跑版
  background-color: #fcfcfc;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid $primary-teal;

  .user-count {
    color: #666;
    font-size: 14px;
  }

  .action-section {
    display: flex;
    gap: 15px;
  }
}

.search-input {
  width: 300px;
  padding: 10px 15px;
  border: 1px solid $border-color;
  border-radius: 6px;
  font-size: 14px;
  &:focus { border-color: $primary-teal; outline: none; }
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid $border-color;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  
  th {
    background-color: #f8f9fa;
    color: $primary-teal;
    font-weight: 600;
    padding: 15px;
    text-align: left;
    border-bottom: 2px solid #eee;
  }

  td {
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
    color: #444;
  }

  .id-cell { font-family: monospace; font-weight: bold; color: #333; }
  .name-cell { font-weight: 500; }

  tr:hover { background-color: #f9fbfb; }
}

.actions {
  display: flex;
  gap: 8px;

  button {
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    border: 1px solid transparent;
    transition: 0.2s;
  }

  .btn-detail {
    background: $primary-teal;
    color: white;
    &:hover { background: darken($primary-teal, 5%); }
  }

  .btn-delete {
    background: white;
    border-color: #ff4d4f;
    color: #ff4d4f;
    &:hover { background: #ff4d4f; color: white; }
  }

}

.empty-state {
  text-align: center;
  padding: 50px;
  color: #999;
}
</style>