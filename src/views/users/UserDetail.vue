<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const userData = ref(null);

onMounted(() => {
  // 1. 從網址取得使用者 ID (例如: /user-detail/170622...)
  const userId = route.params.id;
  
  // 2. 從 LocalStorage 抓取所有註冊者陣列
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
  
  // 3. 尋找對應 ID 的那筆資料
  const foundUser = allUsers.find(u => String(u.id) === String(userId));

  if (foundUser) {
    userData.value = foundUser;
  } else {
    alert('找不到該使用者資料！');
    router.push('/admin/user-list'); // 找不到就退回列表
  }
});
</script>

<template>
  <div class="user-detail-page">
    <div class="header">
      <button @click="router.back()" class="back-btn">← 返回列表</button>
      <h2>使用者詳細檔案</h2>
    </div>

    <div v-if="userData" class="detail-card">
      <section class="info-group">
        <h3>基本資訊</h3>
        <p><strong>姓名：</strong> {{ userData.full_name }}</p>
        <p><strong>Email：</strong> {{ userData.email }}</p>
        <p><strong>電話：</strong> {{ userData.phone_number }}</p>
        <p><strong>性別：</strong> {{ userData.gender === 'M' ? '男' : '女' }}</p>
      </section>

      <section class="info-group">
        <h3>健康檔案 (ER_MODEL)</h3>
        <p><strong>血型：</strong> {{ userData.blood_type }} 型</p>
        <p><strong>身高/體重：</strong> {{ userData.height }}cm / {{ userData.weight }}kg</p>
        <p><strong>家族病史：</strong> {{ userData.family_history || '無' }}</p>
        <p><strong>過敏史：</strong> {{ userData.allergy_history || '無' }}</p>
        <p><strong>慢性病：</strong> {{ userData.chronic_disease_description || '無' }}</p>
      </section>

      <section class="info-group">
        <h3>緊急聯絡人</h3>
        <p><strong>姓名：</strong> {{ userData.emergency_contact_name }}</p>
        <p><strong>關係：</strong> {{ userData.emergency_contact_relationship }}</p>
        <p><strong>電話：</strong> {{ userData.emergency_contact_phone }}</p>
      </section>
    </div>

    <div v-else class="loading">載入中...</div>
  </div>
</template>

<style scoped>
.user-detail-page { padding: 30px; max-width: 800px; margin: 0 auto; }
.header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
.detail-card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.info-group { margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
.info-group h3 { color: #2E6669; margin-bottom: 10px; }
.info-group p { margin: 8px 0; font-size: 16px; }
.back-btn { padding: 8px 16px; border-radius: 6px; border: 1px solid #ccc; cursor: pointer; }
</style>