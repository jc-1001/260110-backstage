<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/apiConfig';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();
const userData = ref(null);

// 1. 改向「大水庫」請求單一使用者詳細資料
const fetchUserDetail = async () => {
  try {
    // 1. 抓取 memberId (必須與 index.js 的 :memberId 對應)
    const mId = route.params.memberId; 
    
    // 2. 請求資料庫資料 (大水庫)
    const res = await axios.get(`${API_ENDPOINTS.USER_LIST}?t=${new Date().getTime()}`);
    const users = Array.isArray(res.data) ? res.data : [];

    // 3. 比對欄位 (必須使用資料庫真實欄位 member_id)
    userData.value = users.find(u => String(u.member_id) === String(mId));

    if (!userData.value) throw new Error('找不到該會員');
    
  } catch (error) {
    console.error('抓取失敗:', error);
  }
};
onMounted(fetchUserDetail);

// 計算狀態文字
const statusText = computed(() => {
  return userData.value?.account_status == 1 ? '使用中' : '已停用';
});

// 計算狀態的 CSS Class (為了變換顏色)
const statusClass = computed(() => {
  return userData.value?.account_status == 1 ? 'status-active' : 'status-disabled';
});

// 停用帳號

const disableAccount = async () => {
  // 1. 安全檢查：確保有抓到會員資料與 ID
  if (!userData.value || !userData.value.member_id) {
    alert("系統忙碌中，請稍後再試。");
    return;
  }

  if (confirm('確定要停用此帳號嗎？停用後該會員將無法登入系統。')) {
    try {
      // 2. 確保網址與 MAMP Port (8888) 一致
      const apiUrl = 'http://localhost:8888/unicare_api/member/toggle_status_api.php';
      
      // UserDetail.vue 內的安全呼叫
      const response = await axios.post(apiUrl, {
        member_id: userData.value.member_id,
        new_status: 0
      });

      // 使用可選鏈結 ?. 防止 undefined 錯誤
      if (response.data?.success) {
        userData.value.account_status = 0;
        alert('停用成功！');
      } else {
        // 這樣就能看到 PHP 傳回來的真實錯誤訊息
        alert('更新失敗: ' + (response.data?.message || '未知錯誤'));
      }
    } catch (error) {
      console.error('API 連線錯誤：', error);
      alert('無法連線至 MAMP 伺服器，請檢查網路設定。');
    }
  }
};

const formattedRegDate = computed(() => {
  if (!userData.value?.created_at) return '載入中...';
  // 將 YYYY-MM-DD HH:mm:ss 轉為 YYYY-MM-DD
  return userData.value.created_at.split(' ')[0]; 
});

</script>

<template>
  <div class="user-detail-container">
    <header class="page-header">
      <h2>使用者詳細資料</h2>
    </header>

    <button @click="router.back()" class="back-btn"> < 返回 </button>

    <div v-if="userData" class="detail-layout">
      <aside class="profile-sidebar">
        <div class="avatar-circle">
          <img src="@\assets\images\common\icon\user-pic.svg" alt="Avatar">
        </div>
        <h2 class="user-name">{{ userData.full_name }}</h2>
        <div class="divider"></div>
        <p class="reg-time">已註冊時間：<span>6個月</span></p> 
      </aside>

      <main class="info-main">
        <section class="info-card">
          <div class="info-item">
            <label>名稱</label>
            <div class="data-box">{{ userData.full_name }}</div>
          </div>
          <div class="info-item">
            <label>電子郵件</label>
            <div class="data-box">{{ userData.email }}</div>
          </div>
          <div class="info-item">
            <label>帳號建立時間</label>
            <div class="data-box">{{ userData.created_at }}</div>
          </div>
        </section>

        <section class="status-card">
          <label>帳號狀態</label>
          <div class="status-control">
            <div class="status-text">
              <span :class="['dot', userData.account_status == 1 ? 'active' : 'disabled']">●</span> 
              {{ userData.account_status == 1 ? '啟用中' : '已停用' }}
            </div>
            
            <button 
              v-if="userData.account_status == 1" 
              @click="disableAccount" 
              class="disable-btn"
            >
              停用帳號
            </button>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$primary-teal: #2E6669;

.user-detail-container { padding: 40px; background-color: #f4f7f7; min-height: 100vh; }
.page-header { border-bottom: 2px solid #ddd; margin-bottom: 20px; h2 { color: $primary-teal; } }

.back-btn {
  background: $primary-teal; color: white; border: none;
  padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-bottom: 20px;
}

.detail-layout { display: grid; grid-template-columns: 280px 1fr; gap: 20px; }

/* 左側側欄樣式 */
.profile-sidebar {
  background: white; padding: 40px 20px; border-radius: 4px; text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  .avatar-circle {
    width: 150px; height: 150px; background: #e8f2f2; border-radius: 50%;
    margin: 0 auto 20px; overflow: hidden;
    img { width: 100%; height: 100%; object-fit: cover; }
  }
  .user-name { font-size: 24px; color: $primary-teal; margin-bottom: 20px; }
  .divider { height: 1px; background: #eee; margin: 20px 0; }
  .reg-time { color: #666; span { font-weight: bold; color: #333; } }
}

/* 右側主要資訊 */
.info-main {
  display: flex; flex-direction: column; gap: 20px;
  .info-card, .status-card { background: white; padding: 30px; border-radius: 4px; }
  
  .info-item {
    margin-bottom: 20px;
    label { display: block; color: $primary-teal; font-weight: bold; margin-bottom: 8px; }
    .data-box { background: #f8f9fa; padding: 12px; border-radius: 4px; color: #444; }
  }
}

.status-control {
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid #eee; padding-top: 20px;
  .status-text {
    .dot.active { color: $primary-teal; margin-right: 5px; }
    small { display: block; color: #999; margin-top: 5px; }
  }
}

.disable-btn {
  background: $primary-teal; color: white; border: none;
  padding: 10px 20px; border-radius: 4px; cursor: pointer;
}
/* UserDetail.vue 樣式修正 */
.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: bold;
}

/* 狀態為 1 時顯示深青色 */
.status-active {
  color: #2E6669;
}

/* 狀態為 0 時顯示橘色或灰色 */
.status-disabled {
  color: #ed8936;
}
</style>