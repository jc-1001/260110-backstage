<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const userId = route.params.id 

const userStatus = ref({
  username: '',
  email: '',
  status: 'active', 
  role: 'user',
  enrollDate: '2024-01-18'
})

onMounted(async () => {
  try {
    const res = await axios.get(`https://fakestoreapi.com/users/${userId}`)
    userStatus.value.username = res.data.username
    userStatus.value.email = res.data.email
  } catch (error) {
    console.error('取得使用者資料失敗:', error)
  }
})

const updateStatus = async () => {
  try {
    console.log('更新資料:', userStatus.value)
    alert(`使用者 ${userStatus.value.username} 狀態已更新為：${userStatus.value.status}`)
    router.push('/users') 
  } catch (error) {
    alert('更新失敗')
  }
}
</script>

<template>
  <div class="update-status-page">
    <div class="status-card">
      <div class="card-header">
        <button class="back-btn" @click="router.push('/users')">
          <span class="material-symbols-rounded"><</span>
        </button>
        <h2>修改帳號狀態</h2>
      </div>

      <div class="card-body">
        <div class="user-preview">
          <div class="avatar">
            <span class="material-symbols-rounded"><img src="@/assets/images/common/icon/user-pic.svg"></span>
          </div>
          <div class="info">
            <h3>{{ userStatus.username || '' }}</h3>
            <p>{{ userStatus.email }}</p>
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <label>電子郵件</label>
            <p># {{ userStatus.email }}</p>
          </div>
          <div class="detail-item">
            <label>帳號建立時間</label>
            <p>{{ userStatus.enrollDate }}</p>
          </div>
          
          <div class="detail-item">
            <label>已登入時間</label>
            <p>{{  }}</p>
          </div>
        </div>

        <hr>

        <form @submit.prevent="updateStatus" class="edit-group">
          <div class="form-item">
            <label>權限角色</label>
            <p>{{ userStatus.role === 'admin' ? '管理員' : '一般使用者' }}</p>
          </div>

          <div class="form-item">
            <label for="status">帳號狀態設定</label>
            <select id="status" v-model="userStatus.status" class="status-select">
              <option value="active">啟用中 (Active)</option>
              <option value="inactive">停用中 (Inactive)</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="router.push('/users')">取消</button>
            <button type="submit" class="btn-submit">儲存變更</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.update-status-page {
  padding: 40px 20px;
  background-color: #f8fbfb;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.status-card {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 20px;
  background: #2e6669;
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
  
  .back-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover { background: rgba(255,255,255,0.3); }
  }
  h2 { font-size: 18px; margin: 0; }
}

.card-body { padding: 30px; }

/* 頭像置中核心樣式 */
.user-preview {
  display: flex;
  flex-direction: column; /* 改為垂直排列 */
  align-items: center;    /* 水平置中 */
  text-align: center;     /* 文字置中 */
  margin-bottom: 30px;

  .avatar {
    width: 80px;
    height: 80px;
    background: #e9f0f0;
    color: #2e6669;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px; /* 增加頭像與文字間距 */
    
    span { font-size: 40px; }
  }

  .info {
    h3 { margin: 0 0 5px 0; color: #333; font-size: 20px; }
    p { margin: 0; color: #888; font-size: 14px; }
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  .detail-item {
    label { font-size: 13px; color: #888; display: block; margin-bottom: 5px; }
    p { font-weight: bold; color: #333; margin: 0; font-size: 15px; }
  }
}

hr { border: 0; border-top: 1px solid #eee; margin: 25px 0; }

.form-item {
  margin-bottom: 20px;
  label { display: block; font-weight: bold; color: #2e6669; margin-bottom: 10px; }
  p { margin: 0; font-size: 16px; color: #444; }
}

.status-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  &:focus { border-color: #2e6669; outline: none; }
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;

  button {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
  }

  .btn-cancel {
    background: #f5f5f5;
    border: none;
    color: #666;
    &:hover { background: #eee; }
  }

  .btn-submit {
    background: #2e6669;
    border: none;
    color: white;
    &:hover { background: #3d868a; }
  }
}
</style>