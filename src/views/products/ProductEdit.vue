<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, ArrowLeft, CircleCheck, Remove } from '@element-plus/icons-vue'
import adminHeader from '@/components/admin/adminHeader.vue'
import { publicApi } from '@/utils/publicApi'
import { parsePublicFile } from '@/utils/parseFile'

const route = useRoute()
const router = useRouter()

// 抓取網址上的id，如果有值就是編輯模式
const productId = route.params.id

// 判斷是否為編輯模式
const isEditMode = computed(() => !!productId) // 轉成布林值

// 控制庫存編輯狀態
const isStockEdit = ref(false)

// 定義表單資料
const form = ref({
  name: '',
  category: '',
  price: '',
  status: 1,
  stock: 0,
  decs: '',
  tag: '',
  keyword: '',
  Spec: '',
  features: [''],
  details: {
    dosage: '',
    quantity: '',
    days: '',
    usage: '',
    warning: ''
  }
})

const imageList = ref([
  { id: 0, url: '' }, // 主圖
  { id: 1, url: '' },
  { id: 2, url: '' },
  { id: 3, url: '' },
  { id: 4, url: '' },
  { id: 5, url: '' },
  { id: 6, url: '' },
])

const categoryOptions = [
  { value: 1, label: '骨骼關節保養' },
  { value: 2, label: '心血管循環' },
  { value: 3, label: '晶亮護眼' }
]

const statusOptions = [
  { value: 1, label: '上架' },
  { value: 0, label: '下架' },
]

// 產品介紹 =========================

// 新增特色
const addFeature = () => {
  form.value.features.push('')
}

// 刪除特色
const removeFeature = (index) => {
  form.value.features.splice(index, 1)
}

// 圖片處理 =========================
const handleAvatarSuccess = (index, uploadFile) => {
  if (uploadFile.raw) {
    imageList.value[index].url = URL.createObjectURL(uploadFile.raw)
    imageList.value[index].rawFile = uploadFile.raw
  }
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('格式錯誤!')
    return false
  }
  return true
}
const removeImage = (index) => {
  imageList.value[index].url = ''
  imageList.value[index].rawFile = null
}

// 資料存取 =========================

// 回填資料
const fetchProductData = async (id) => {
  try {
    const res = await publicApi.get(`admin/get_product_by_id.php?id=${id}`)
    const data = res.data
    if (!data) return

    form.value.name = data.title
    form.value.category = data.category_id
    form.value.price = data.price
    form.value.stock = data.stock_quantity
    form.value.status = data.is_on_shelf
    form.value.decs = data.description
    form.value.tag = data.tag
    form.value.keyword = data.keywords
    form.value.Spec = data.spec

    form.value.features = Array.isArray(data.features) && data.features.length > 0 ? data.features : ['']

    if (data.details) form.value.details = { ...form.value.details, ...data.details }

    // 圖片回填
    // parsePublicFile 會自動加上 API 的 domain
    if (data.image) {
      imageList.value[0].url = parsePublicFile(data.image)
    }
    
    if (data.gallery && data.gallery.length > 0) {
      data.gallery.forEach((item, index) => {
        if (index < 6) {
          imageList.value[index + 1].url = parsePublicFile(item.large_url)
        }
      })
    }

  } catch (err) {
    console.error(err)
  }
}

// 儲存資料
const handleSave = async () => {
  try {
    const formData = new FormData()
    if (isEditMode.value) formData.append('id', productId)
    
    formData.append('name', form.value.name)
    formData.append('category', form.value.category)
    formData.append('price', form.value.price)
    formData.append('stock', form.value.stock)
    formData.append('status', form.value.status)
    formData.append('decs', form.value.decs)
    formData.append('tag', form.value.tag)
    formData.append('keywords', form.value.keyword)
    formData.append('spec', form.value.Spec)

    const validFeatures = form.value.features.filter(f => f.trim() !== '')
    validFeatures.forEach(f => formData.append('features[]', f))

    formData.append('details[dosage]', form.value.details.dosage)
    formData.append('details[quantity]', form.value.details.quantity)
    formData.append('details[days]', form.value.details.days)
    formData.append('details[usage]', form.value.details.usage)
    formData.append('details[warning]', form.value.details.warning)

    if (imageList.value[0].rawFile) {
      formData.append('main_image', imageList.value[0].rawFile)
    }
    
    for (let i = 1; i < imageList.value.length; i++) {
      const item = imageList.value[i]
      if (item.rawFile) {
        formData.append('gallery_files[]', item.rawFile)
      } else if (item.url && !item.url.startsWith('blob:')) {
        const match = item.url.match(/(images\/shop\/.*)/)
        if (match) {
            formData.append('existing_gallery[]', match[1])
        } else {
            formData.append('existing_gallery[]', item.url)
        }
      }
    }

    const res = await publicApi.post('admin/product_save.php', formData)
    if (res.data.success) {
      ElMessage.success(res.data.message)
      router.push('/products')
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('儲存失敗')
  }
}


// 刪除商品
const handleDelete = () => {
  ElMessageBox.prompt('危險操作，請輸入員工編號', '取消訂單', {
    confirmButtonText: '確認刪除',
    cancelButtonText: '關閉',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await publicApi.post('admin/product_delete.php', {id: productId})

      if(res.data.success) {
        ElMessage.success('商品已刪除')
        router.push('/products') // 刪完回列表
      } else {
        ElMessage.error(res.data.message || '刪除失敗')
      }
    } catch (err) {
      console.error(err)
      ElMessage.error('刪除發生錯誤')
    }
  }).catch(() => {
    console.log('取消刪除商品')
  })
}

// 如果是編輯模式，就撈資料
onMounted(() => {
  if (isEditMode.value) {
    fetchProductData(productId)
  }
})

</script>

<template>
  <adminHeader :title="isEditMode ? '編輯商品' : '新增商品'" />
  
  <div class="top-tool-bar">
    <div class="left-actions">
      <router-link to="/products" custom v-slot="{ navigate }">
        <el-button class="back-btn" :icon="ArrowLeft" @click="navigate">返回</el-button>
      </router-link>
    </div>

    <div class="right-actions">
      <el-button v-if="isEditMode" class="del-btn" type="danger" :icon="Delete" @click="handleDelete"
        >刪除商品</el-button
      >

      <el-button class="save-btn" :icon="CircleCheck" @click="handleSave">
        {{ isEditMode ? '儲存修改' : '確定新增' }}
      </el-button>
    </div>
  </div>
  
  <main class="product-page">
    <section class="left">
      <section class="product-upload-container">
        <h3 class="section-title">商品圖片</h3>
        <div class="upload-layout">
          <div v-for="(item, index) in imageList" :key="item.id" :class="['upload-item', index === 0 ? 'main-item' : 'sub-item']">
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
        </div>
      </section>
      <section class="add-stock">
        <h3 class="section-title">庫存資訊</h3>
        <div v-if="!isStockEdit" class="stock-display">
          <div class="stock-num">
            <span>庫存數量</span>
            <span class="num">{{ form.stock || 0 }}</span>
          </div>
          <el-button class="add-stock-button" @click="isStockEdit = true">調整庫存量</el-button>
        </div>
        <div v-else class="stock-edit">
          <el-input v-model="form.stock" type="number" placeholder="輸入庫存量"/>
          <el-button type="success" class="confirm-stock-button" @click="isStockEdit = false">確定</el-button>
        </div>
      </section>
    </section>

    <section class="product-describe">
      <div class="field-item full-width">
        <h3 class="section-title">商品名稱</h3>
        <el-input v-model="form.name" placeholder="請輸入商品名稱" />
      </div>
      <div class="field-item full-width">
        <h3 class="section-title">商品簡介</h3>
        <el-input v-model="form.decs" placeholder="請簡要描述商品" />
      </div>
      <div class="field-item full-width">
        <h3 class="section-title">商品關鍵字</h3>
        <el-input v-model="form.keyword" placeholder="請輸入商品關鍵字" />
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
          <h3 class="section-title">商品標籤</h3>
          <el-input v-model="form.tag" placeholder="輸入商品標籤 (如: 熱銷冠軍、全家適用)" />
        </div>
        <div class="field-item">
          <h3 class="section-title">售價</h3>
          <el-input v-model="form.price" placeholder="輸入金額" />
        </div>
        <div class="field-item">
          <h3 class="section-title">產品規格</h3>
          <el-input v-model="form.Spec" placeholder="如: 60 錠/袋" />
        </div>
      </div>
      <div class="row-group">
        <div class="field-item">
          <h3 class="section-title">狀態</h3>
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
      <div class="edit-block">
        <div class="block-header">
            <h3 class="section-title" style="margin-bottom:0">產品介紹</h3>
            <el-button type="primary" size="small" :icon="Plus" @click="addFeature" plain>新增介紹</el-button>
        </div>
        <div class="feature-list" style="margin-top: 12px">
          <div v-for="(feat, index) in form.features" :key="index" class="feature-row">
            <el-input v-model="form.features[index]" placeholder="請輸入一項產品特色..." />
            <el-button type="danger" circle :icon="Remove" @click="removeFeature(index)" plain/>
          </div>
        </div>
      </div>
      <div class="edit-block">
        <h3 class="section-title">詳細規格</h3>
        <div class="detail-grid">
          <div class="field-item"><label>劑型</label><el-input v-model="form.details.dosage"/></div>
          <div class="field-item"><label>數量</label><el-input v-model="form.details.quantity"/></div>
          <div class="field-item"><label>參考食用天數</label><el-input v-model="form.details.days"/></div>
          <div class="field-item full-width"><label>建議食用方式</label><el-input v-model="form.details.usage"/></div>
          <div class="field-item full-width"><label>注意事項</label><el-input v-model="form.details.warning" type="textarea" :rows="3"/></div>
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
    margin-bottom: 12px;
    font-size: 14px;
    .num { 
      font-weight: bold; 
      font-size: 16px; 
    }
  }
}

/* 庫存 */
.add-stock-button { 
  width: 100%; 
  background-color: #333; 
  color: white; 
  border: none; }

.confirm-stock-button { 
  width: 100%; 
  margin-top: 8px; 
}


.upload-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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
  width: 60px;
  height: 60px;
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
  &:hover{
    background-color: $primary;
  }
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

.block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #eee;
    padding-bottom: 8px;
}

.feature-row { 
  display: flex;
  gap: 8px;
  margin-bottom: 8px; 
}

.detail-grid { 
  display: grid;
  grid-template-columns: 1fr 1fr; 
  gap: 16px; 
  background-color: #f8f9fa; 
  padding: 16px; 
  border-radius: 8px; 
  label { 
    display: block; 
    margin-bottom: 4px; 
    font-size: 13px; 
    color: #666; 
  } 
}
.row-group { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 20px; 
}
.full-width { 
  grid-column: 1 / -1; 
}
</style>