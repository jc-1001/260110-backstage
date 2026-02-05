<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue' 
import { ElMessage, ElMessageBox } from 'element-plus'
import { parsePublicFile } from '@/utils/parseFile'
import { publicApi } from '@/utils/publicApi'
import adminHeader from '@/components/admin/adminHeader.vue'

const router = useRouter()

// 搜尋字串
const searchText = ref('')

// 多選儲存區
const multipleSelection = ref([])

// 模擬商品資料
const productList = ref([])

// 抓商品資料
const fetchData = async () => {
  try {
    const res = await publicApi.get('admin/get_products.php')

    productList.value = res.data.data
  } catch(err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchData()
})

// --- 邏輯區 ---
const filteredData = computed(() => {
  if (!searchText.value) return productList.value
  return productList.value.filter(item => 
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

const currentPage = ref(1)
const pageSize = ref(10)
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// 庫存燈號
const getStockStatus = (stock) => {
  if (stock <= 0) return 'status_red'
  if (stock < 50) return 'status_yellow'
  return 'status_green'
}

const getStockText = (stock) => {
  if (stock <= 0) return '缺貨'
  if (stock > 100) return '>100'
  if (stock < 50) return `<${stock}`
  return stock
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 處理批次上/下架
const handleBatchAction = async (action) => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('請先勾選商品')
    return
  }
  
  const ids = multipleSelection.value.map(item => item.id)
  const actionText = action === 'on' ? '上架' : '下架'
  
  ElMessageBox.confirm(`確定要將選取的 ${multipleSelection.value.length} 項商品執行「${actionText}」嗎？`, '提示', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await publicApi.post('admin/batch_update_product.php', {
        ids: ids,
        action: action
      })

      if(res.data.success) { 
        ElMessage.success('更新成功')
        fetchData()
      }
    } catch (err) {
      console.error(err)
      ElMessage.error('更新失敗')
    }
  })
}

// 下架時整行變灰
const tableRowClassName = ({ row }) => {
  if (row.isOnShelf === false) {
    return 'row_disabled'
  }
  return ''
}

// 根據狀態回傳對應的 class
const getTagClass = (isOnShelf) => {
  return isOnShelf ? 'tag-success' : 'tag-error'
}

// 新增按鈕
const goAddProduct = () => {
  router.push('/products/add')
}

// 編輯按鈕
// 記得在 template 傳入 scope.row.id
const goEditProduct = (id) => {
  router.push(`/products/edit/${id}`)
}

</script>

<template>
  <div class="product_list_page">
    <adminHeader title="商品管理" />
    
    <div class="toolbar">
      <div class="left_actions">
        <el-button class="btn_action btn_on" @click="handleBatchAction('on')">上架</el-button>
        <el-button class="btn_action btn_off" @click="handleBatchAction('off')">下架</el-button>
      </div>

      <div class="right_actions">
        <el-input
          v-model="searchText"
          placeholder="搜尋商品"
          :prefix-icon="Search"
          class="search_input"
          clearable
        />
        <el-button type="primary" class="btn_add" :icon="Plus" @click="goAddProduct">
          新增商品
        </el-button>
      </div>
    </div>

    <div class="table_container">
      <el-table 
        :data="pagedData" 
        style="width: 100%"
        header-cell-class-name="table_header_green"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        
        <el-table-column label="商品名稱" min-width="250">
          <template #default="scope">
            <div class="product_info">
              <img :src="parsePublicFile(scope.row.image)" class="p_img" alt="img">
              <span class="p_name">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="category" label="分類" width="200" align="center"/>
        <el-table-column prop="price" label="售價" width="180" sortable align="center"/>
        
        <el-table-column label="庫存" width="120" sortable>
          <template #default="scope">
            <div class="stock_cell">
              <span class="dot" :class="getStockStatus(scope.row.stock)"></span>
              <span>{{ getStockText(scope.row.stock) }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="狀態" width="100" align="center">
          <template #default="scope">
            <el-tag 
              :class="getTagClass(scope.row.isOnShelf)"
              effect="dark"
            >
              {{ scope.row.isOnShelf ? '上架中' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column width="80" align="center">
          <template #default="scope">
            <el-button :icon="Edit" size="small" plain class="btn_edit" @click="goEditProduct(scope.row.id)"/>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div class="pagination_area">
      <span class="total_info">共 {{ filteredData.length }} 項產品 | 目前顯示 {{ pagedData.length }} 項</span>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="filteredData.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>

  </div>
</template>

<style lang="scss" scoped>
.product_list_page {
  min-height: 100vh;
  box-sizing: border-box;
}

// 工具列
.toolbar {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  
  .left_actions {
    display: flex;

    .btn_action {
      border: none;
      color: $white;
      &:hover { opacity: 0.9; }
    }

    .btn_on {
      background-color: $primaryDark; 
    }

    .btn_off {
      color: $black;
      background-color: $white; 
    }
  }

  .right_actions {
    display: flex;
    gap: 12px;
    .search_input { width: 200px; }
    .btn_add { background-color: $primaryDark; border-color: $primaryDark; } 
  }
}

// 表格樣式
.table_container {
  background: $white;
  border-radius: 4px;
  overflow: hidden; 

  :deep(.table_header_green) {
    background-color: $primaryDark !important; 
    color: $white !important;
    font-weight: bold;
    border-bottom: none;
  }

  // 下架時整行變灰
  :deep(.row_disabled) {
    background-color: #f9f9f9 !important; 
    color: #999;
    .p_name { color: #999; }
  }

  .product_info {
    display: flex;
    align-items: center;
    gap: 12px;
    .p_img {
      width: 50px; height: 50px;
      object-fit: cover;
      border: 1px solid #eee;
      background-color: #fff;
    }
    .p_name {
      font-weight: bold;
      color: $primaryDark;
    }
  }

  .stock_cell {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      &.status_green { 
        background-color: $primary;
      }
      &.status_yellow {
        background-color: #FDD835;
      }
      &.status_red {
        background-color: $accent;
      }
    }
  }

  // 狀態標籤樣式
  .tag-success {
    background-color: $primary; 
    border-color: $primary;
    color: $white;
    border: none;
  }
  .tag-error {
    background-color: $grayDark;
    border-color: $grayDark;
    color: $white;
    border: none;
  }

  .btn_edit {
    border-color: #dcdfe6;
    color: #666;
    &:hover { color: $primary; border-color: $primary; }
  }
}

.pagination_area {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 14px;
}
</style>