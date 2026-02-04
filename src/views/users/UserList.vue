<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { API_ENDPOINTS } from '@/config/apiConfig';

  const router = useRouter();
  const users = ref([]);
  const searchQuery = ref('');

  // UserList.vue 中的 fetchUsers 修改
  const fetchUsers = async () => {
    try {
      // 加上時間戳記 t=${new Date().getTime()}，防止瀏覽器緩存舊資料
      const res = await axios.get(`http://localhost:8888/unicare_api/member/user_api.php?t=${new Date().getTime()}`);
      users.value = res.data; 
      console.log("最新資料庫資料：", users.value);
    } catch (error) {
      console.error("連線失敗：", error);
    }
  };

onMounted(() => {
  fetchUsers(); // 確保每次進來後台管理，都先去大水庫提水
});

  // 2. 分頁與搜尋邏輯
  const currentPage = ref(1);
  const itemsPerPage = 20;

  const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;
    return users.value.filter(user => 
      user.full_name.includes(searchQuery.value) || 
      user.email.includes(searchQuery.value)
    );
  });

  const totalUsers = computed(() => filteredUsers.value.length);
  const totalPages = computed(() => Math.ceil(totalUsers.value / itemsPerPage));
  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredUsers.value.slice(start, start + itemsPerPage);
  });

  const startItem = computed(() => totalUsers.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1);
  const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, totalUsers.value));

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };
  // UserList.vue 的跳轉邏輯
const goToDetail = (user) => {
  router.push({ 
    name: 'UserDetail', 
    params: { memberId: user.member_id } // 標籤叫 memberId，值給 member_id
  });
};
</script>

<template>
  <div class="admin-user-list">
    <header class="admin-header">
      <div class="title-section">
        <h2 style="color: #2E6669;">使用者管理</h2>
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
          <tr 
            v-for="user in paginatedUsers" 
            :key="user.member_id" 
            @click="router.push({ name: 'UserDetail', params: { memberId: user.member_id } })"
            class="clickable-row"
          >
            <td class="id-cell">{{ user.full_name }}</td>
            <td class="name-cell">{{ user.email }}</td>
            <td>{{ user.created_at }}</td>
            <td>
              <span :class="['status-badge', user.account_status == 1 ? 'active' : 'disabled']">
                {{ user.account_status == 1 ? '● 啟用中' : '● 已停用' }}
              </span>
            </td>
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
      <tr v-for="user in paginatedUsers" :key="user.id">  </tr>
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
    background-color: #245254;
    color: #fff;
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

  .id-cell { font-family: monospace; font-weight: bold; color: #333; color: #245254;}
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
    color: #2E6669; // 深綠色文字
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
.clickable-row { cursor: pointer; transition: background 0.2s; }
.clickable-row:hover { background-color: #f0f7f7 !important; }
</style>