<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Search as SearchIcon } from '@element-plus/icons-vue'
import adminHeader from '@/components/admin/adminHeader.vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { publicApi } from '@/utils/publicApi'

const noticesList = ref([])
const search = ref('')
// 串接APi(get) 取得資料
const fetchData = async () => {
  try {
    const res = await publicApi.get('announcements/get_ann_admin.php')
    noticesList.value = res.data
  } catch (error) {
    console.log('後台抓取失敗', error)
  }
}
onMounted(() => {
  fetchData()
})

// --- 分頁變數 ---
const total = computed(() => filterTableData.value.length) // 總筆數動態變更
const currentPage = ref(1) // 當前頁碼
const pageSize = ref(10) // 每頁顯示幾筆

// 搜尋框輸入資料過濾邏輯
const filterTableData = computed(() => {
  // 先過濾搜尋內容
  const filtered = noticesList.value.filter(
    (item) => !search.value || item.title.toLowerCase().includes(search.value.toLowerCase()),
  )
  return filtered
})

// 真正餵給表格的資料：過濾後再切片
const pagedTableData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filterTableData.value.slice(startIndex, endIndex)
})
// 計算當前顯示的起始序號
const rangeStart = computed(() => {
  if (total.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

// 計算當前顯示的結束序號
const rangeEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, total.value)
})

// 處理換頁點擊
const handleCurrentChange = (val) => {
  currentPage.value = val
}
// 監聽搜尋框、下拉選單、日期
watch([search], () => {
  currentPage.value = 1
})
// 每一行的樣式判斷
const tableRowClassName = ({ row }) => {
  if (!row) return '' // 如果 row 還沒加載，直接回傳空字串
  // 讓 down 和 draft 都套用 .status-down 的灰色樣式
  if (row.status === 'down' || row.status === 'draft') return 'status-down'
  if (row.status === 'schedule') return 'status-schedule'
  return `status-${row.status}`
}

// 標籤顏色判斷
const getTagClass = (announcement_type) => {
  if (announcement_type === '系統公告') return 'tag-teal'
  if (announcement_type === '商城活動') return 'tag-event'
  return ''
}
// 編輯按鈕
// 記得在 template 傳入 scope.row.announcement_id
const goEditNotice = (announcement_id) => {
  router.push(`/notices/edit/${announcement_id}`)
}
</script>
<template>
  <!-- 表頭 -->
  <div class="admin-layout">
    <adminHeader title="系統訊息與活動" />
  </div>
  <!-- 表格 -->
  <!-- 根據什麼規則去抓取對應的 CSS 類別（Class） -->
  <!-- :row-class-name是定義 「每一行的樣式規則」 -->
  <!-- header-cell-class-name="custom-header" 將 custom-header 這個自定義名稱掛到 <thead > 裡面的單元格上 -->
  <div class="table-container">
    <!-- 搜尋框 -->
    <div class="table-toolbar">
      <el-input
        v-model="search"
        placeholder="搜尋標題"
        :prefix-icon="SearchIcon"
        class="search-input"
        clearable
        style="width: 25%"
      />
      <div class="new-noteButton">
        <router-link to="/notices/edit/" custom v-slot="{ navigate }">
          <el-button @click="navigate">
            <span class="material-symbols-outlined">add</span>新增訊息
          </el-button>
        </router-link>
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="pagedTableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      header-cell-class-name="custom-header"
    >
      <el-table-column label="訊息標題" prop="title" min-width="200">
        <template #default="scope">
          <span class="title-link">{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="訊息類型" prop="announcement_type" sortable width="150">
        <template #default="scope">
          <el-tag :class="getTagClass(scope.row?.announcement_type)" effect="dark">
            {{ scope.row?.announcement_type }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="發布者" prop="admin_name" sortable width="150">
        <template #default="scope">
          <span>{{ scope.row.admin_name || '管理員 ' + scope.row.created_by_admin_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="發布時間" prop="start_at" sortable width="180" />

      <el-table-column label="訊息狀態" prop="status" sortable width="120">
        <template #default="scope">
          <span :class="['status-text', 'text-' + scope.row?.status]">
            <template v-if="scope.row?.status === 'upload'">已發布</template>
            <template v-else-if="scope.row?.status === 'down'">已下架</template>
            <template v-else-if="scope.row?.status === 'schedule'">排程中</template>
            <template v-else-if="scope.row?.status === 'draft'">草稿</template>
            <template v-else>未知</template>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="編輯" width="80" align="center">
        <template #default="scope">
          <router-link
            :to="'/notices/edit/' + scope.row.announcement_id"
            custom
            v-slot="{ navigate }"
          >
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
    <div class="total-text">
      共 {{ total }} 筆訊息 | 目前顯示 1 至 {{ pagedTableData.length }} 筆
    </div>

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
.tag-teal {
  background-color: $accent;
  color: $white;
  border: none;
}
.tag-event {
  background-color: $accentLight;
  color: $black;
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
/**  小筆記~~~
:deep(): 因為 el-table 會渲染出深層的 HTML 結構（如 <tr>, <td>），而在 scoped 模式下，一般的 CSS 選取器鑽不進去。:deep() 能確保樣式穿透組件，套用到表格的每一行。
/* 讓已下架的行變灰色且半透明 */
:deep(.status-down) {
  background-color: #e8e8e8 !important;
  color: $grayDark !important;

  .title-link {
    color: #a8abb2 !important;
  }
  .el-tag {
    background-color: $grayDark !important;
    color: $white !important;
  }
}

/* 定義的表頭與標籤... */
:deep(.custom-header) {
  background-color: $primaryDark !important;
  color: $white !important;
}
// 商品狀態顏色
.status-text {
  font-weight: bold;

  &.text-upload {
    color: $primary;
  }
  &.text-down {
    color: $grayDark;
  }
  &.text-schedule {
    color: $accent;
  }
  &.text-draft {
    color: $grayDark;
  }
}
.new-noteButton {
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
