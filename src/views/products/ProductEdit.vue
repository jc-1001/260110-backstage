<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete, ArrowLeft, CircleCheck } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 CSS 樣式
import { onBeforeUnmount, shallowRef, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import adminHeader from '@/components/admin/adminHeader.vue'

// 處理捨棄按鈕邏輯
const handleDiscard = () => {
  ElMessageBox.confirm('確定要捨棄目前輸入的內容嗎？', '提醒', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 執行返回邏輯
    console.log('已捨棄內容')
  })
}

// 處理儲存按鈕邏輯
const handleSave = () => {
  // 在這裡收集你之前的 form 數據與 3 個編輯器的 HTML
  const finalData = {
    ...form.value,
    images: imageList.value.filter((img) => img.url),
    intro: introHtml.value,
    spec: specHtml.value,
    shipping: shippingHtml.value,
  }
  console.log('準備提交的數據：', finalData)
  ElMessage.success('商品新增成功！')
}

// 定義三個區塊的 HTML 內容
const introHtml = ref('') // 產品介紹
const specHtml = ref('') // 商品規格
const shippingHtml = ref('') // 配送須知

// 定義三個編輯器的實例
const introEditorRef = shallowRef()
const specEditorRef = shallowRef()
const shippingEditorRef = shallowRef()

// 編輯器配置
const editorConfig = {
  placeholder: '請輸入內容...',
  MENU_CONF: {},
}

// 分別處理 Created 事件
const handleIntroCreated = (editor) => {
  introEditorRef.value = editor
}
const handleSpecCreated = (editor) => {
  specEditorRef.value = editor
}
const handleShippingCreated = (editor) => {
  shippingEditorRef.value = editor
}

// 組件卸載時銷毀所有編輯器
onBeforeUnmount(() => {
  const editors = [introEditorRef.value, specEditorRef.value, shippingEditorRef.value]
  editors.forEach((editor) => {
    if (editor) editor.destroy()
  })
})

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
  <adminHeader title="新增商品" />
  <!-- 按鈕區 -->
  <div class="top-tool-bar">
    <div class="left-actions">
      <router-link to="/products/" custom v-slot="{ navigate }">
        <el-button class="back-btn" :icon="ArrowLeft" @click="navigate">返回</el-button>
      </router-link>
    </div>

    <div class="right-actions">
      <el-button class="del-btn" type="danger" :icon="Delete" @click="handleDiscard"
        >捨棄</el-button
      >

      <el-button class="save-btn" :icon="CircleCheck" @click="handleSave">確定新增</el-button>
    </div>
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
          <span>0</span>
        </div>
        <el-button class="add-stock-button">調整庫存</el-button>
      </section>
    </section>

    <section class="product-describe">
      <div class="field-item full-width">
        <h3 class="section-title">商品名稱</h3>
        <el-input v-model="form.name" placeholder="請輸入商品名稱" />
      </div>
      <div class="field-item full-width">
        <h3 class="section-title">商品簡介</h3>
        <el-input v-model="form.decsShort" placeholder="請簡要描述商品" />
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
        <div class="field-item">
          <h3 class="section-title">產品規格</h3>
          <el-input v-model="form.Spec" placeholder="如: 60 錠/袋" />
        </div>
        <div class="field-item">
          <h3 class="section-title">初始庫存</h3>
          <el-input v-model="form.stock" placeholder="輸入庫存數量" />
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
      </div>
      <hr />
      <!-- 富文本輸入框 -->
      <div class="edit-block">
        <div class="desc-block">
          <h3 class="section-title">產品介紹</h3>
          <div class="editor-container">
            <Editor
              style="height: 150px; overflow-y: hidden; overflow-x: hidden"
              v-model="introHtml"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleIntroCreated"
            />
          </div>
        </div>

        <div class="desc-block">
          <h3 class="section-title">商品規格</h3>
          <div class="editor-container">
            <Editor
              style="height: 150px; overflow-y: hidden; overflow-x: hidden"
              v-model="specHtml"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleSpecCreated"
            />
          </div>
        </div>

        <div class="desc-block">
          <h3 class="section-title">配送須知</h3>
          <div class="editor-container">
            <Editor
              style="height: 150px; overflow-y: hidden; overflow-x: hidden"
              v-model="shippingHtml"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleShippingCreated"
            />
          </div>
        </div>
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
.top-tool-bar {
  justify-content: space-between;
}
.save-btn.el-button {
  // 設定按鈕的主背景色
  background-color: $primaryDark;
  color: white;
  &:hover {
    background-color: lighten($primaryDark, 5%);
    border-color: lighten($primaryDark, 5%);
    opacity: 0.9;
    color: white;
  }
}
.left-actions .back-btn.el-button {
  background-color: $primary;
  color: white;
  &:hover {
    background-color: lighten($primary, 5%);
    border-color: lighten($primary, 5%);
    opacity: 0.9;
    color: white;
  }
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
.edit-block {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
  .editor-container {
    border: 1px solid $gray;
  }
}
:deep(.el-radio) {
  //  選取後的樣式
  &.is-checked {
    .el-radio__inner {
      background-color: $primaryDark !important;
      border: none;
    }

    /* 選取後的文字顏色 */
    .el-radio__label {
      color: $black !important;
      font-weight: $fontWeightBold;
    }
  }
}
</style>
