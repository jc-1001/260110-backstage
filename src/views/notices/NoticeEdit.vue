<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 CSS 樣式
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import adminHeader from '@/components/admin/adminHeader.vue'
import { ArrowLeft, Delete, CircleCheck } from '@element-plus/icons-vue'
// 編輯器實例，必須用 shallowRef
const editorRef = shallowRef()

// 內容 HTML
const valueHtml = ref('')

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
const editorConfig = { placeholder: '請輸入內容...' }

// 組件銷毀時，也及時銷毀編輯器 // 重要~~~
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 記錄 editor 實例
}
const input = ref('') // 對應標題輸入框 v-model="input"
const value = ref('') // 對應下拉選單 v-model="value"
const isNow = ref(false) // 對應勾選框 v-model="isNow"
const slcDateStart = ref('')
const slcDateEnd = ref('')
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

import { watch } from 'vue'

// 當點選「立即發布」時
watch(isNow, (newVal) => {
  if (newVal) {
    const today = new Date().toISOString().split('T')[0] // 取得今日日期 YYYY-MM-DD
    slcDateStart.value = today
  }
})
</script>

<template>
  <main>
    <adminHeader title="新增系統訊息" />
    <!-- 按鈕區 -->
    <div class="mes-tool-bar">
      <router-link to="/notices/" custom v-slot="{ navigate }">
        <el-button :icon="ArrowLeft" @click="navigate"> 返回 </el-button>
      </router-link>
      <div class="right">
        <el-button type="danger" :icon="Delete" @click="handleDelete"> 刪除 </el-button>
        <el-button :icon="CircleCheck" @click=""> 儲存發布 </el-button>
      </div>
    </div>
    <!-- 系統屬性區 -->
    <div class="mes-detail">
      <div class="mes-row">
        <h4 class="label">標題</h4>
        <div class="content">
          <el-input v-model="input" placeholder="請輸入標題" />
        </div>
      </div>

      <div class="mes-row">
        <h4 class="label">訊息類型</h4>
        <div class="content">
          <el-select v-model="value" placeholder="選擇公告類型" style="width: 240px">
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
              <el-date-picker v-model="slcDateStart" type="date" placeholder="開始日期" />
              <el-checkbox v-model="isNow" label="立即發布" class="ml-10" />
            </div>
            <el-date-picker v-model="slcDateEnd" type="date" placeholder="結束日期" />
          </div>
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
        style="min-height: 300px; overflow-y: hidden"
        v-model="valueHtml"
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
}
</style>
