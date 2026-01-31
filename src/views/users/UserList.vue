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

// 分頁狀態
const currentPage = ref(1);
const itemsPerPage = 20;

// 計算總使用者人數
const totalUsers = computed(() => filteredUsers.value.length);

// 計算目前顯示的範圍
const startItem = computed(() => totalUsers.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1);
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, totalUsers.value));

// 計算總頁數
const totalPages = computed(() => Math.ceil(totalUsers.value / itemsPerPage));

// 搜尋過濾
const filteredUsers = computed(() => {
  return users.value.filter(user => 
    user.full_name.includes(searchQuery.value) || 
    user.email.includes(searchQuery.value)
  );
});

// 表格實際要顯示的資料（分頁後的資料）
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

// 切換頁面
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // 切換頁面時自動回到頂端
    window.scrollTo(0, 0);
  }
};

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
        <h2>使用者管理</h2>
      </div>
      
      <div class="action-section">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜尋使用者"
          class="search-input"
        >
      </div>
    </header>

    <div class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>電子信箱</th>
            <th>帳號建立時間</th>
            <th>帳號狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="id-cell">{{ user.full_name }}</td>
            <td class="name-cell">{{ user.email }}</td>
            <td>{{ user.created_at }}</td>
            <td>
              <span :class="['status-badge', user.is_active ? 'active' : 'disabled']">
                {{ user.is_active ? '● 啟用中' : '● 已停用' }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="empty-state">目前尚無使用者資料</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-footer">
        <div class="pagination-status">
          共 {{ totalUsers }} 位使用者 | 目前顯示 {{ startItem }} 至 {{ endItem }} 位
        </div>

        <div class="pagination-nav">
          <button class="nav-btn prev" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
            <i class="fas fa-chevron-left"> < </i>
          </button>
          
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="changePage(page)"
            :class="['page-num', { active: currentPage === page }]"
          >
            {{ page }}
          </button>

          <button class="nav-btn next" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
            <i class="fas fa-chevron-right"> > </i>
          </button>
        </div>
      </div>

      <tr v-for="user in paginatedUsers" :key="user.id"> ... </tr>
  </div>
</template>

<style lang="scss" scoped>
$primary-teal: #2E6669;
$border-color: #e0e0e0;

.admin-user-list {
  padding: 40px;
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

.empty-state {
  text-align: center;
  padding: 50px;
  color: #999;
}
.status-badge {
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;

  // 啟用中：顯示綠色
  &.active {
    color: #2e7d32; // 深綠色文字
  }

  // 已停用：顯示橘色
  &.disabled {
    color: #ef6c00; // 深橘色文字
  }
}

.pagination-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}

.pagination-status {
  color: #2E6669;
  font-size: 14px;
}

.pagination-nav {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;

  button {
    border: none;
    border-right: 1px solid #ddd;
    background: white;
    height: 40px;
    min-width: 40px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;

    &:last-child { border-right: none; }
    
    // 頁碼
    &.page-num {
      color: #333;
      padding: 0 15px;
      
      &.active {
        background-color: #FFF3E0; // 輔色
        color: #333;
        font-weight: bold;
      }
    }

    // 上下頁深青色樣式
    &.nav-btn {
      background-color: #2E6669; // 主色
      color: white;
      
      &:disabled {
        background-color: #8bb1b3;
        cursor: not-allowed;
      }
    }

    &:hover:not(:disabled) {
      background-color: #f5f5f5;
      &.nav-btn { background-color: #245254; }
    }
  }
}
.search-input {
  width: 300px;
  padding: 10px 15px 10px 40px; // 左側增加 padding 留給 icon 空間
  font-size: 14px;
  
  // 加入放大鏡圖示
  background-image: url('@/assets/images/common/icon/Group 116.png');
  background-repeat: no-repeat;
  background-position: 12px center; // 控制圖示位置
  background-size: 16px;

}
</style>