<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import adminHeader from '@/components/admin/adminHeader.vue'

const route = useRoute()
const router = useRouter()

const orderId = route.params.id

// 模擬訂單資料
const orderData = ref({
  id: orderId,
  status: '待處理',
  createTime: '2025/12/10 08:45:30',
  paymentMethod: '信用卡',
  
  // 訂購人資訊
  user: {
    name: '高金生',
    email: 'roger7414@gmail.com',
    phone: '0987-123-456',
    address: '新北市北投區公館路7號',
    note: '請幫我放在一樓管理室，乾蝦餒!'
  },

  // 配送資訊
  shipping: {
    method: '宅配',
    status: '未出貨'
  },

  // 商品列表
  products: [
    {
      id: 1,
      name: '海洋鈣鎂D+強效錠',
      image: '/images/shop/product_01.jpg',
      price: 480,
      qty: 2
    },
    {
      id: 2,
      name: '葡萄糖胺軟骨素複方',
      image: '/images/shop/product_02.jpg',
      price: 820,
      qty: 1
    }
  ],

  // 金額計算
  summary: {
    subtotal: 3750,
    shippingFee: 60,
    discount: 40,
    total: 3770
  }
})

// 圖片路徑處理 (防呆部署問題)
const processImage = (path) => {
  // 取得 Base URL (Vite 設定)
  const baseUrl = import.meta.env.BASE_URL || '/'
  // 移除路徑開頭的斜線，避免重複 (例如 //images)
  return baseUrl + path.replace(/^\//, '')
}

// 返回訂單列表
const goBack = () => {
  router.push('/orders')
}

// 按鈕 - 出貨
const handleShip = () => {
  ElMessageBox.confirm('確定要執行出貨嗎?', '出貨確認', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    orderData.value.status = '已出貨'
    orderData.value.shipping.status = '配送中'
    ElMessage.success('訂單已更新為出貨狀態！')
  })
}

// 按鈕 - 取消訂單
const handleCancel = () => {
  ElMessageBox.prompt('請輸入取消原因', '取消訂單', {
    confirmButtonText: '確認取消',
    cancelButtonText: '關閉',
  }).then(({ value }) => {
    orderData.value.status = '已取消'
    ElMessage.info(`訂單已取消，原因：${value}`)
  })
}
</script>

<template>
  <div class="order_edit_page">
    <adminHeader title="訂單詳情" />
    
    <div class="top_bar">
      <el-button :icon="ArrowLeft" @click="goBack" class="back_btn">返回</el-button>
      <div class="actions">
        <el-button @click="handleCancel">取消訂單</el-button>
        <el-button type="primary" @click="handleShip" class="ship_btn">出貨</el-button>
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
        <div class="info_item">
          <span class="label">付款方式</span>
          <span class="value">{{ orderData.paymentMethod }}</span>
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
              <div class="card_header">配送資訊</div>
            </template>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="配送方式">{{ orderData.shipping.method }}</el-descriptions-item>
              <el-descriptions-item label="配送狀態">{{ orderData.shipping.status }}</el-descriptions-item>
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
    background-color: $primaryDark; 
    border-color: $primaryDark;
    &:hover {
      background-color: $primary;
      border-color: $primary;
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