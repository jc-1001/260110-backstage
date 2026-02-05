<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, onMounted, computed, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import adminHeader from '@/components/admin/adminHeader.vue'
import { ArrowLeft, Delete, CircleCheck } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { publicApi } from '@/utils/publicApi'

const route = useRoute()
const router = useRouter()
const noticeId = route.params.id // 攫取網址上的id
const status = ref('draft') // 預設為草稿
// 判斷是否為為編輯模式
const isEditMode = computed(() => !!noticeId)

// 編輯器實例，必須用 shallowRef
const editorRef = shallowRef()

// 內容 HTML
const content = ref('')

const toolbarConfig = {
  // 放入出現的功能 Key
  toolbarKeys: [
    'bold', // 粗體
    'italic', // 斜體
    'underline', // 下劃線
    'through', // 刪除線
    '|', // 分隔線圖示
    'bulletedList', // 無序列表
    'numberedList', // 有序列表
    'indent', // 增加縮排
    'delIndent', // 減少縮排
    '|', // 分隔線圖示
    'divider', // 插入分割線
  ],
}
const editorConfig = {
  placeholder: '請輸入內容...',
  MENU_CONF: {
    // 設定字體大小的選項
    fontSize: {
      fontSizeList: ['12px', '14px', '16px', '20px', '24px', '32px'],
    },
  },
}
// 組件銷毀時，也及時銷毀編輯器 // 重要~~~
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 記錄 editor 實例
}
const title = ref('') // 對應標題輸入框 v-model="title"
const announcement_type = ref('') // 對應下拉選單 v-model="announcement_type"
const isNow = ref(false) // 對應勾選框 v-model="isNow"
const start_at = ref('')
const end_at = ref('')
const options = [
  {
    value: '系統公告',
    label: '系統公告',
  },
  {
    value: '商城活動',
    label: '商城活動',
  },
]

// 模擬/請求資料並填入表單(利用async/await)
const fetchNoticeDetail = async () => {
  if (!isEditMode.value) return
  try {
    const res = await publicApi.get('announcements/get_ann_detail.php', {
      params: { id: noticeId },
    })

    if (res.data && res.data.success) {
      const detail = res.data.data
      title.value = detail.title
      announcement_type.value = detail.announcement_type
      start_at.value = detail.start_at ? new Date(detail.start_at) : ''
      end_at.value = detail.end_at ? new Date(detail.end_at) : ''
      content.value = detail.content
      // ✅ 同步 Radio Group 的狀態
      status.value = detail.status
      // ✅ 同步 Checkbox (如果已經是上架狀態，勾選立即發布)
      isNow.value = detail.status === 'upload'
    }
  } catch (error) {
    console.error('抓取詳情失敗:', error)
  }
}

onMounted(() => {
  fetchNoticeDetail()
})

// 支援時分 (YYYY-MM-DD HH:mm)
const formatDate = (date) => {
  if (!date) return null
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// 系統公告期間結束日期不可以大於開始日期
const disableEndDate = (time) => {
  if (!start_at.value) return false
  return time.getTime() < new Date(start_at.value).getTime()
}

// 儲存發布
const handleSave = async () => {
  // 1. 建立一個過濾 HTML 的小工具
  const stripHtml = (html) => {
    if (!html) return ''
    // 去除標籤並處理 HTML 實體符號 (如 &nbsp;)
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
  }

  // 打包要送給 API 的資料物件 (Payload)
  const payload = {
    title: title.value,
    announcement_type: announcement_type.value,
    content: stripHtml(content.value),
    // 將 Date 物件轉回字串格式，避免後端解析出錯
    start_at: formatDate(start_at.value),
    end_at: formatDate(end_at.value),
    status: status.value,
    created_by_admin_id: 1,
  }
  // console.log('準備送出資料：', payload)
  // 串接API(POST)
  try {
    let res

    if (isEditMode.value) {
      // 資料庫中現有的資料
      res = await publicApi.post('announcements/update_ann_admin.php', payload, {
        params: {
          id: noticeId,
        },
      })
    } else {
      // 新增一筆
      res = await publicApi.post('announcements/add_ann_admin.php', payload)
    }

    if (res.data.success) {
      alert(isEditMode.value ? '修改成功！' : '新增成功!')
      router.push('/notices')
    }
  } catch (error) {
    console.log('儲存失敗', error)
    alert('系統錯誤，請稍後再試')
  }
}
// 修改 watch：當勾選「立即發布」時，自動切換 Radio 到「上架」
watch(isNow, (newVal) => {
  if (newVal) {
    status.value = 'upload' // ✅ 自動切換 Radio
    start_at.value = formatDate(new Date())
  }
})
// 刪除與儲存動作
// 串接API刪除
const handleDelete = () => {
  // 新增模式因為沒存檔所以直接跳回列表頁
  if (!isEditMode.value) {
    router.push('/notices')
    return
  }
  // 編輯模式按刪除會有詢問彈窗

  ElMessageBox.confirm('此操作將永久刪除該公告，是否繼續？', '警告', {
    confirmButtonText: '確定刪除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      console.log('前端準備發送的 noticeId:', noticeId) // Ok
      try {
        const res = await publicApi.get('announcements/delete_ann_admin.php', {
          params: {
            id: noticeId,
          },
        })

        console.log('後端回傳結果:', res.data) // 除錯用

        if (res.data.success) {
          ElMessage.success('刪除成功!')
          router.push('/notices')
        } else {
          ElMessage.error('刪除失敗' + (res.data.message || '原因未知'))
        }
      } catch (error) {
        console.error('API 請求失敗:', error)
        ElMessage.error('伺服器請求失敗，請檢查網路或 API 路徑')
      }
    })
    .catch(() => {
      // 使用者點擊取消，不會有任何事情發生
    })
}
</script>

<template>
  <main>
    <adminHeader :title="isEditMode ? '編輯系統訊息' : '新增系統訊息'" />
    <!-- 按鈕區 -->
    <div class="mes-tool-bar">
      <router-link to="/notices/" custom v-slot="{ navigate }">
        <el-button :icon="ArrowLeft" @click="navigate"> 返回 </el-button>
      </router-link>
      <div class="right">
        <el-button type="danger" :icon="Delete" @click="handleDelete"> 刪除 </el-button>
        <el-button :icon="CircleCheck" @click="handleSave"> 儲存發布 </el-button>
      </div>
    </div>
    <!-- 系統屬性區 -->
    <div class="mes-detail">
      <div class="mes-row">
        <h4 class="label">標題</h4>
        <div class="content">
          <el-input v-model="title" placeholder="請輸入標題" maxlength="50" show-word-limit />
        </div>
      </div>

      <div class="mes-row">
        <h4 class="label">訊息類型</h4>
        <div class="content">
          <el-select v-model="announcement_type" placeholder="選擇公告類型" style="width: 240px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <div class="mes-row">
        <h4 class="label">公告時間</h4>
        <div class="content">
          <div class="time-group">
            <div class="time-picker-row">
              <el-date-picker
                v-model="start_at"
                type="datetime"
                placeholder="開始日期"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
              />
              <el-checkbox v-model="isNow" label="立即發布" class="ml-10" />
            </div>
            <el-date-picker
              v-model="end_at"
              type="datetime"
              placeholder="結束日期"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              :disabled-date="disableEndDate"
            />
          </div>
        </div>
      </div>

      <div class="mes-row">
        <h4 class="label">顯示狀態</h4>
        <div class="content">
          <el-radio-group v-model="status">
            <el-radio-button label="draft">草稿</el-radio-button>
            <el-radio-button label="upload">上架</el-radio-button>
            <el-radio-button label="down">下架</el-radio-button>
            <el-radio-button label="schedule">排程中</el-radio-button>
          </el-radio-group>
          <span class="status-tip" v-if="status === 'upload'">* 公告將排程時間顯示在前台</span>
          <span class="status-tip" v-if="status === 'schedule'"
            >* 公告將根據預定的排程時間自動顯示在前台，請留意時間設定</span
          >
        </div>
      </div>
    </div>
    <!-- 富文本輸入框 -->
    <div class="edit-block">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        mode="default"
      />
      <Editor
        style="min-height: auto; overflow-y: hidden"
        v-model="content"
        :defaultConfig="editorConfig"
        mode="default"
        @onCreated="handleCreated"
      />
    </div>
  </main>
</template>
<style scoped lang="scss">
.mes-tool-bar {
  display: flex;
  justify-content: space-between;
  .el-button:not(.el-button--danger) {
    // 設定按鈕的主背景色
    background-color: $primaryDark;
    color: white;
    &:hover {
      opacity: 0.9;
      color: white;
    }
  }
}

.mes-detail {
  background-color: $white;
  border: 1px solid $grayLight; // 外框線
  margin-top: 20px;
  padding: 0 20px;

  .mes-row {
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid $grayDark; // 每一列下方的橫線

    &:last-child {
      // 最後一列不需要底線
      border-bottom: none;
    }

    .label {
      width: 120px;
      margin: 0;
      color: $primaryDark;
      font-size: 16px;
      font-weight: bold;
    }

    .content {
      flex: 1; // 佔滿剩餘空間
      display: flex;
      align-items: center;

      // 一般輸入框
      .el-input {
        max-width: 900px;
      }
    }
  }
}

// 時間輸入框
.time-group {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .time-picker-row {
    display: flex;
    align-items: center;
    gap: 15px;
  }
}

.ml-10 {
  margin-left: 10px;
}

:deep(.el-checkbox) {
  /* 選取後的框框*/
  &.is-checked .el-checkbox__inner {
    background-color: $primaryDark !important;
    border-color: $primaryDark !important;
  }

  /* 選取的內部勾勾*/
  &.is-checked .el-checkbox__inner::after {
    border-color: $white !important; // 勾勾顏色
    border-width: 2px;
  }

  /* 選取後的文字*/
  &.is-checked .el-checkbox__label {
    color: $black !important;
    font-weight: bold;
  }
}

/*右側箭頭圖標顏色 */
:deep(.el-select .el-input__suffix .el-icon) {
  color: $primaryDark;
}

.edit-block {
  margin-top: 10px;
  :deep(.w-e-scroll) {
    height: 150px;
  }
}

.status-tip {
  margin-left: 15px;
  font-size: 13px;
  color: #e6a23c; // 警告色
  font-weight: 500;
}
/* Radio Button 顏色 */
:deep(.el-radio-button) {
  // 未選中樣式
  .el-radio-button__inner {
    background-color: $white !important;
    box-shadow: -1px 0 0 0 $primaryDark !important;
    // 懸停
    &:hover {
      color: $primary;
    }
  }
  // 選中樣式
  &.is-active .el-radio-button__inner {
    background-color: $primaryDark !important;
    color: $white !important;
    box-shadow: none !important;
  }
}
</style>
