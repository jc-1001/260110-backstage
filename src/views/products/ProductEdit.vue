<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 CSS 樣式
import { onBeforeUnmount, shallowRef, onMounted } from 'vue'

// 編輯器實例，必須用 shallowRef
const editorRef = shallowRef()

// 內容 HTML
const valueHtml = ref('')

const toolbarConfig = {
  // 放入出現的功能 Key
  toolbarKeys: [
    'fontSize', // 字型大小
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

const form = ref({
  name: '',
  category: '',
  price: '',
  status: '',
  stock: '',
})

const imageList = ref([
  { id: 0, url: '' },
  { id: 1, url: '' },
  { id: 2, url: '' },
  { id: 3, url: '' },
  { id: 4, url: '' },
  { id: 5, url: '' },
])

const categoryOptions = [
  { value: '骨骼關節保養', label: '骨骼關節保養' },
  { value: '心血管循環', label: '心血管循環' },
  { value: '維他命', label: '維他命' },
  { value: '晶亮護眼', label: '晶亮護眼' },
]

const statusOptions = [
  { value: '上架', label: '上架' },
  { value: '下架', label: '下架' },
]

const handleAvatarSuccess = (index, uploadFile) => {
  if (uploadFile.raw) {
    imageList.value[index].url = URL.createObjectURL(uploadFile.raw)
  }
}

const beforeAvatarUpload = (rawFile) => {
  const isImage = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png'
  const isLt2M = rawFile.size / 1024 / 1024 < 2
  if (!isImage) ElMessage.error('圖片必須是 JPG 或 PNG 格式!')
  if (!isLt2M) ElMessage.error('圖片大小不能超過 2MB!')
  return isImage && isLt2M
}

const removeImage = (index) => {
  imageList.value[index].url = ''
  ElMessage.success('圖片已移除')
}
</script>

<template>
  <div class="top-tool-bar">
    <el-button>返回</el-button>
    <el-button>捨棄</el-button>
    <el-button>確定新增</el-button>
  </div>
  <main class="product-page">
    <section class="left">
      <section class="product-upload-container">
        <h3 class="section-title">商品圖片</h3>
        <div class="upload-layout">
          <div
            v-for="(item, index) in imageList"
            :key="item.id"
            :class="['upload-item', index === 0 ? 'main-item' : 'sub-item']"
          >
            <el-upload
              class="avatar-uploader"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="(file) => handleAvatarSuccess(index, file)"
              :before-upload="beforeAvatarUpload"
            >
              <div v-if="item.url" class="avatar-container">
                <img :src="item.url" class="avatar-img" />
                <div class="upload-actions" @click.stop="removeImage(index)">
                  <el-icon><Delete /></el-icon>
                </div>
              </div>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </div>
          <el-button class="upload-button">上傳圖片</el-button>
        </div>
      </section>
      <section class="add-stock">
        <h3 class="section-title">庫存資訊</h3>
        <div class="stock-num">
          <span>庫存數量</span>
          <span>123</span>
        </div>
        <el-button class="add-stock-button">調整庫存</el-button>
      </section>
    </section>

    <section class="product-describe">
      <div class="field-item full-width">
        <h3 class="section-title">商品名稱</h3>
        <el-input v-model="form.name" placeholder="請輸入商品名稱" />
      </div>

      <div class="row-group">
        <div class="field-item">
          <h3 class="section-title">分類</h3>
          <el-select v-model="form.category" placeholder="請選擇分類" style="width: 100%">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="field-item">
          <h3 class="section-title">售價</h3>
          <el-input v-model="form.price" placeholder="輸入金額" />
        </div>
      </div>
      <div class="row-group">
        <div class="field-item">
          <h3 class="section-title">狀態</h3>
          <!-- <el-select > -->
          <el-radio-group v-model="form.status" placeholder="請選擇狀態" style="width: 100%">
            <el-radio
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-radio>
          </el-radio-group>
        </div>
        <div class="field-item">
          <h3 class="section-title">初始庫存</h3>
          <el-input v-model="form.stock" placeholder="輸入庫存數量" />
        </div>
      </div>
      <hr />
      <!-- 富文本輸入框 -->
      <div class="edit-block">
        <h3 class="section-title">商品描述</h3>
        <Toolbar
          style="border: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          mode="default"
        />
        <Editor
          style="min-height: auto; border: 1px solid #ccc; height: 150px; overflow-y: hidden"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          mode="default"
          @onCreated="handleCreated"
        />
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.left {
  display: flex;
  flex-direction: column;
  flex: 0.3; // 圖片區塊佔比
}
.product-describe {
  flex: 1; // 描述區塊佔比
  display: flex;
  flex-direction: column;
  gap: 24px;

  .row-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
.section-title {
  font-size: 14px;
  color: $primaryDark;
  margin-bottom: 8px;
  font-weight: bold;
}
.top-tool-bar,
.product-page {
  display: flex;
  gap: 20px;
  padding: 8px;
  align-items: flex-start;
}

.product-upload-container,
.product-describe {
  padding: 24px;
  background-color: $white;
  //   border-radius: 8px;
  box-shadow: $shadowDark;
}

.add-stock {
  margin-top: 20px;
  padding: 24px;
  background-color: $white;
  box-shadow: $shadowDark;
  .stock-num {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 12px;
  }
}

.upload-layout {
  display: flex;
  flex-wrap: wrap;
  //   gap: 16px; //圖片距離
}

/* 圖片框樣式 */
.main-item .avatar-uploader-icon,
.main-item .avatar-container,
.main-item .avatar-img {
  width: 200px;
  height: 200px;
}

.sub-item .avatar-uploader-icon,
.sub-item .avatar-container,
.sub-item .avatar-img {
  width: 40px;
  height: 40px;
}

.avatar-container {
  position: relative;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
}
.avatar-img {
  display: block;
  object-fit: contain;
}
.avatar-uploader-icon {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border-color: $primaryDark;
    color: $primaryDark;
  }
}
.upload-actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}
.upload-button,
.add-stock-button {
  margin-top: 10px;
  background-color: $primaryDark;
  color: #fff;
  width: 100%;
}
// :deep(.el-select) {
//   /* 選取後的框框*/
//   &.is-select .el-select__inner {
//     background-color: $primaryDark !important;
//     border-color: $primaryDark !important;
//   }

//   /* 選取的內部勾勾*/
//   &.is-select .el-select__inner::after {
//     border-color: $white !important; // 勾勾顏色
//     border-width: 2px;
//   }

//   /* 選取後的文字*/
//   &.is-select .el-select__label {
//     color: $black !important;
//     font-weight: bold;
//   }
// }
</style>
