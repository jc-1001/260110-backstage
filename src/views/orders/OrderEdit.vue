<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { publicApi } from '@/utils/publicApi'
import adminHeader from '@/components/admin/adminHeader.vue'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id

// 訂單資料結構
const orderData = ref({
  id: '',
  status: '',
  createTime: '',  
  // 訂購人資訊
  user: {
    name: '',
    email: '',
    phone: '',
    address: '',
    note: ''
  },

  // 付款資訊
  payment: {
    method: '',
    status: 0
  },

  // 購買商品
  products: [],

  // 金額計算
  summary: {
    subtotal: 0,
    shippingFee: 0,
    discount: 0,
    total: 0
  }
})

// 抓取訂單資料api
const fetchData = async () => {
  try {
    const res = await publicApi.get('http://localhost:8888/unicare_api/admin/get_order_detail.php', {params:{ id: orderId }})

    if(!res.data) {
      ElMessage.error('找不到該筆訂單')
      router.push('/orders')
      return
    }

    // 將後端資料填入
    orderData.value = res.data
  } catch (err) {
    console.error(err)
    ElMessage.error('資料載入失敗')
  }
}

// 畫面載入時執行
onMounted(()=>{
  fetchData()
})

// 點擊狀態按鈕呼叫api (開始備貨/出貨/取消)
const updateStatus = async (newStatus, note = '') => {
  try {
    const res = await publicApi.post('http://localhost:8888/unicare_api/admin/update_order_status.php', {
      id: orderData.value.id,
      status: newStatus,
      note: note
    })

    if(res.data.success) {
      // 後端更新成功後才更新前端畫面
      orderData.value.status = newStatus
      // 如果有備註，順便更新顯示
      if(note) orderData.value.user.note += `(取消原因: ${note})`

      ElMessage.success(`已更新訂單狀態為: ${newStatus}`)
    }
  } catch(err) {
    console.error(err)
    ElMessage.error('更新失敗，請稍後再嘗試')
  }
}


// 圖片路徑處理 (防呆部署問題)
const processImage = (path) => {
  if(!path) return''
  // 取得 Base URL (Vite 設定)
  const baseUrl = import.meta.env.BASE_URL || '/'
  // 移除路徑開頭的斜線，避免重複 (例如 //images)
  return baseUrl + path.replace(/^\//, '')
}

// 返回訂單列表
const goBack = () => {
  router.push('/orders')
}

// 按鈕 - 備貨
const handlePrepare = () => {
  ElMessageBox.confirm('確定要開始備貨嗎?', '出貨確認', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 呼叫api
    updateStatus('備貨中')
  })
}

// 按鈕 - 出貨
const handleShip = () => {
  ElMessageBox.confirm('確定要執行出貨嗎?', '出貨確認', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    updateStatus('已出貨')
  })
}

// 按鈕 - 取消訂單
const handleCancel = () => {
  ElMessageBox.prompt('請輸入取消原因', '取消訂單', {
    confirmButtonText: '確認取消',
    cancelButtonText: '關閉',
  }).then(({ value }) => {
    updateStatus('已取消', value)
  })
}
</script>

<template>
  <div class="order_edit_page">
    <adminHeader title="訂單詳情" />
    
    <div class="top_bar">
      <el-button :icon="ArrowLeft" @click="goBack" class="back_btn">返回</el-button>
      <div class="actions">
        <el-button type="primary" @click="handlePrepare" class="prepare_btn" :disabled="orderData.status === '已取消'" :class="{'disabled': orderData.status === '已取消'}">開始備貨</el-button>
        <el-button type="primary" @click="handleShip" class="ship_btn" :disabled="orderData.status === '已取消' " :class="{'disabled': orderData.status === '已取消'}">出貨</el-button>
        <el-button @click="handleCancel" class="cancel_btn" type="primary" :disabled="orderData.status === '已取消' " :class="{'disabled': orderData.status === '已取消'}">取消訂單</el-button>
      </div>
    </div>

    <el-card class="status_bar_card">
      <div class="status_row">
        <div class="info_item">
          <span class="label">訂單狀態</span>
          <el-tag :type="orderData.status === '已出貨' ? 'success' : orderData.status === '已取消' ? 'info' : 'warning'" effect="dark">
            {{ orderData.status }}
          </el-tag>
        </div>
        <div class="info_item">
          <span class="label">訂購時間</span>
          <span class="value">{{ orderData.createTime }}</span>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" class="main_content">
      <el-col :span="8">
        <div class="left_panel">
          <el-card class="info_card">
            <template #header>
              <div class="card_header">訂購人資訊</div>
            </template>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="姓名">{{ orderData.user.name }}</el-descriptions-item>
              <el-descriptions-item label="電子郵件">{{ orderData.user.email }}</el-descriptions-item>
              <el-descriptions-item label="姓名">{{ orderData.user.phone }}</el-descriptions-item>
              <el-descriptions-item label="地址">{{ orderData.user.address }}</el-descriptions-item>
              <el-descriptions-item label="訂單備註">{{ orderData.user.note }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
          
          <el-card class="info_card">
            <template #header>
              <div class="card_header">付款資訊</div>
            </template>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="付款方式">{{ orderData.payment.method == 'credit' ? '信用卡' : 'ATM' }}</el-descriptions-item>
              <el-descriptions-item label="付款狀態">{{ orderData.payment.status == 0 ? '未付款':'已付款' }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
      </el-col>

      <el-col :span="16">
        <el-card class="product_card">
          <el-table 
            :data="orderData.products" 
            style="width: 100%" 
            header-cell-class-name="table_header_green"
          >
            <el-table-column label="商品名稱">
              <template #default="scope">
                <div class="product_info">
                  <img :src="processImage(scope.row.image)" alt="product" class="p_img">
                  <span class="p_name">{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="單價" prop="price" align="center" width="120">
              <template #default="scope">${{ scope.row.price.toLocaleString() }}</template>
            </el-table-column>
            
            <el-table-column label="數量" prop="qty" align="center" width="100"></el-table-column>
            
            <el-table-column label="小計" align="right" width="120">
              <template #default="scope">${{ (scope.row.price * scope.row.qty).toLocaleString() }}</template>
            </el-table-column>
          </el-table>

          <div class="summary_section">
            <div class="summary_row">
              <span>商品總金額</span>
              <span>${{ orderData.summary.subtotal.toLocaleString() }}</span>
            </div>
            <div class="summary_row">
              <span>運費</span>
              <span>${{ orderData.summary.shippingFee }}</span>
            </div>
            <div class="summary_row discount">
              <span>積分折抵</span>
              <span>-${{ orderData.summary.discount }}</span>
            </div>
            <div class="divider"></div>
            <div class="summary_row total">
              <span>訂單總金額</span>
              <span class="highlight">${{ orderData.summary.total.toLocaleString() }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.order_edit_page {
  min-height: 100vh;
  overflow-x: hidden;
}

// 頂部工具列
.top_bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .ship_btn {
    padding: 0 32px;
    background-color: $primaryDark; 
    border-color: $primaryDark;
    &:not(.disabled):hover {
      background-color: $white;
      color: $primaryDark;
      border-color: $primaryDark;
    }
    &.disabled {
      display: none;
      background-color: $disabled;
      border-color: $disabled;
    }
  }
  .prepare_btn {
    padding: 0 32px;
    background-color: $primary;
    border-color: $primary;
    &:not(.disabled):hover {
      background-color: $white;
      color: $primaryDark;
      border-color: $primaryDark;
    }
    &.disabled {
      display: none;
      background-color: $disabled;
      border-color: $disabled;
    }
  }
  .cancel_btn {
    &.disabled {
      display: none;
      background-color: $disabled;
      border-color: $disabled;
    }
  }
}

// 狀態條
.status_bar_card {
  margin-bottom: 20px;
  border: none;
  .status_row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .info_item {
      display: flex;
      align-items: center;
      gap: 12px;
      .label {
        font-weight: bold;
        color: #555;
      }
      .value {
        color: $black;
      }
    }
  }
}

// 左側卡片樣式
.left_panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info_card {
  border: none;
  :deep(.el-card__header) {
    background-color: $primary; 
    color: $white;
    padding: 10px 15px;
    border-bottom: none;
  }
  .card_header {
    font-weight: bold;
    font-size: 14px;
  }
  
  :deep(.el-descriptions__label) {
    background-color: #E0F2F1; 
    color: $primaryDark;
    font-weight: bold;
    width: 80px;
    text-align: center;
  }
}

// 右側商品卡片
.product_card {
  border: none;
  :deep(.el-card__body) {
    padding: 0; 
  }

  // 綠色表頭樣式
  :deep(.table_header_green) {
    background-color: $primary !important;
    color: $white !important;
    font-weight: bold;
  }

  .product_info {
    display: flex;
    align-items: center;
    gap: 12px;
    .p_img { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
    .p_name { font-weight: bold; color: $black; }
  }

  .summary_section {
    padding: 20px;
    background-color: $white;
    
    .summary_row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      color: #666;

      &.discount {
        font-weight: bold;
        color: $primary;
      } 
      &.total {
        margin-top: 10px;
        font-size: 16px;
        color: $black;
        font-weight: bold;
        align-items: center;
        .highlight {
          font-size: 24px;
          color: $black;
        }
      }
    }
    .divider {
      margin: 10px 0;
      height: 1px;
      background-color: #eee;
    }
  }
}
</style>