<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Search as SearchIcon } from '@element-plus/icons-vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { publicApi } from '@/utils/publicApi'
import AdminHeader from '@/components/admin/adminHeader.vue'
const ordersList = ref([])
const search = ref('')
const value = ref('') // 對應下拉選單 v-model="value"
const slcDate = ref('') //對應日期 v-model="slcDate"
// 只要定義數據，表格就會自動長出來
// 假資料(引入data/adminNotice.json)

const fetchData = () => {
  publicApi
    // .get('https://fakestoreapi.com/products')
    .get('data/adminOrderList.json')
    .then((response) => {
      // handle success -> 把請求後得到的資料丟給ordersList
      ordersList.value = response.data
    })

    .catch((error) => {
      // handle error
      console.log(error)
    })
    .finally(() => {
      // always executed
    })
}
onMounted(() => {
  fetchData()
})

// --- 分頁變數 ---
const total = computed(() => filterTableData.value.length) // 總筆數動態變更
const currentPage = ref(1) // 當前頁碼
const pageSize = ref(10) // 每頁顯示幾筆

// 搜尋框輸入資料過濾邏輯
//修正過濾與分頁邏輯 (加上 .slice 做分頁切片)
const filterTableData = computed(() => {
  return ordersList.value.filter((item) => {
    // 文字搜尋 (訂單編號 或 訂購人)
    const searchTerm = search.value.toLowerCase()
    const matchesSearch =
      !search.value ||
      item.order_id.toLowerCase().includes(searchTerm) ||
      item.customer.toLowerCase().includes(searchTerm)
    // 訂單狀態篩選
    const matchesStatus = !value.value || item.status === value.value
    // 下單日期篩選
    let matchesDate = true
    if (slcDate.value) {
      const d = new Date(slcDate.value)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const formattedDate = `${year}/${month}/${day}`

      // 使用 startsWith 只比對日期部分(忽略後面的時間)
      matchesDate = item.order_time.startsWith(formattedDate)
    }

    // 必須三個條件都符合才顯示
    return matchesSearch && matchesStatus && matchesDate
  })
})

// 真正餵給表格的資料：過濾後再切片
const pagedTableData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filterTableData.value.slice(startIndex, endIndex)
})
// 監聽搜尋框、下拉選單、日期
watch([search, value, slcDate], () => {
  currentPage.value = 1
})
// 每一行的樣式判斷
const tableRowClassName = ({ row }) => {
  if (row.status === '已取消') return 'status-disabled'
  return ''
}

// 標籤顏色判斷
const getTagClass = (status) => {
  const statusMap = {
    待處理: 'tag-pending',
    已出貨: 'tag-success',
    已取消: 'tag-error',
  }
  return statusMap[status] || ''
}
// 訂單狀態選項
const options = [
  { value: '', label: '全部' },
  {
    value: '待處理',
    label: '待處理',
  },
  {
    value: '已出貨',
    label: '已出貨',
  },
  {
    value: '已取消',
    label: '已取消',
  },
]
</script>
<template>
  <!-- 表頭 -->
  <div class="admin-layout">
    <adminHeader title="訂單管理" />
  </div>
  <!-- 表格 -->
  <!-- 根據什麼規則去抓取對應的 CSS 類別（Class） -->
  <!-- :row-class-name是定義 「每一行的樣式規則」 -->
  <!-- header-cell-class-name="custom-header" 將 custom-header 這個自定義名稱掛到 <thead > 裡面的單元格上 -->
  <div class="table-container">
    <!-- 上方工具列 -->
    <div class="table-toolbar">
      <el-input
        v-model="search"
        placeholder="搜尋訂單編號或訂購人"
        :prefix-icon="SearchIcon"
        class="search-input"
        clearable
        style="width: 25%"
      />
      <div class="orderStatus-dropdown">
        <span>訂單狀態</span>
        <el-select v-model="value" placeholder="全部" style="width: 240px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="search-day">
        <span>下單日期</span>
        <el-date-picker v-model="slcDate" type="date" placeholder="選擇日期" />
      </div>
      <!-- 要不要取消呢??????? -->
      <!-- <div class="searchButton">
        <el-button @click="navigate">
          <span>搜尋</span>
        </el-button>
      </div> -->
    </div>

    <el-table
      :data="pagedTableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      header-cell-class-name="custom-header"
    >
      <el-table-column label="訂單編號" prop="order_id" sortable min-width="150">
        <template #default="scope">
          <span class="title-link">{{ scope.row.order_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="訂單狀態" prop="status" sortable width="120">
        <template #default="scope">
          <el-tag :class="getTagClass(scope.row.status)" effect="dark">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="訂購人" prop="customer" sortable width="150" />

      <el-table-column label="訂購時間" prop="order_time" sortable width="200" />

      <el-table-column label="訂單金額" prop="amount" sortable width="150">
        <template #default="scope">
          <span class="amount-text">NT$ {{ scope.row.amount?.toLocaleString() }}</span>
        </template>
      </el-table-column>

      <el-table-column label="編輯" width="80" align="center">
        <template #default="scope">
          <router-link :to="'/orders/edit/' + scope.row.order_id" custom v-slot="{ navigate }">
            <el-button size="small" @click="navigate">
              <span class="material-symbols-outlined">edit_square</span>
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 表格下方分頁及文字 -->
  <div class="pagination-container">
    <div class="total-text">共 {{ total }} 筆訂單 | 目前顯示 {{ pagedTableData.length }} 筆</div>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      :prev-icon="ArrowLeft"
      :next-icon="ArrowRight"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped lang="scss">
// 總共幾頁樣式
.total-text {
  color: $primaryDark;
}
// 分頁樣式
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  color: #555; // 字體顏色
  font-size: 14px;
}

:deep(.el-pagination) {
  // 箭頭按鈕樣式
  button {
    border-radius: none;
    background-color: $primaryDark !important;
    color: white !important;
    &:disabled {
      //禁用
      background-color: #b2dfdb !important;
    }
  }

  // 頁碼樣式
  .el-pager li {
    background-color: #fff;
    min-width: 32px;

    &.is-active {
      background-color: $accentLight !important; // 選中時的淡橘黃色
      color: $accent !important; // 選中時的橘色字
      border-color: $accentLight;
    }

    &:hover {
      color: $primary;
    }
  }
}

.el-pager li {
  background-color: $white; // 頁碼背景

  &.is-active {
    background-color: $accent; // 選中時的橘黃色
    color: $accentLight;
  }
}

/* 對應屬性定義的名稱 訊息狀態 */
:deep(.custom-header) {
  background-color: $primaryDark !important;
  color: $white !important;
}

.tag-pending {
  background-color: $accent;
  color: $white;
  border: none;
}
.tag-success {
  background-color: $primary;
  color: $white;
  border: none;
}
.tag-error {
  background-color: $grayDark;
  color: $white;
  border: none;
}
.el-button {
  border: none;
}
.table-toolbar {
  margin: 16px 0;
  display: flex;
  justify-content: space-between;
}
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 20px; /* 調整 icon 大小 */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
}
.orderStatus-dropdown,
.search-day {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  span {
    font-size: 14px;
    color: $primaryDark;
    font-weight: $fontWeightBold;
  }
}

/**  小筆記~~~
:deep(): 因為 el-table 會渲染出深層的 HTML 結構（如 <tr>, <td>），而在 scoped 模式下，一般的 CSS 選取器鑽不進去。:deep() 能確保樣式穿透組件，套用到表格的每一行。
/* 讓已下架的行變灰色且半透明 */
/* 讓已取消的行變灰色 */
:deep(.status-disabled) {
  background-color: #e8e8e8 !important;
  color: $grayDark !important;

  .title-link {
    color: #a8abb2 !important;
  }
  .amount-text {
    font-weight: bold;
    color: $grayDark;
  }
}

.amount-text {
  font-weight: bold;
  color: $primaryDark;
}

/* 定義的表頭與標籤... */
:deep(.custom-header) {
  background-color: $primaryDark !important;
  color: $white !important;
}

.searchButton {
  text-align: center;
  .material-symbols-outlined {
    margin-right: 10px;
  }
  .el-button {
    background: $primaryDark !important;
    color: $white !important;
  }
}
</style>
