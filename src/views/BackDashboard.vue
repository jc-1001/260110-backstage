<script setup>
import AdminHeader from '@/components/admin/adminHeader.vue'
import { ref } from 'vue'

const quanData = ref([
  {
    id: "members-number",
    title: "使用者總數",
    value: "8763",
  },
  {
    id: "members-increase",
    title: "本月增加使用者",
    value: "250",
    trend: "up",
  },
  {
    id: "orders-today",
    title: "今日訂單數量",
    value: "89",
    trend: "down",
  },
  {
    id: "orders-pending",
    title: "待處理訂單數量",
    value: "24",
  },
])

const periodBtn = ['月', '季', '年']
const activeBtnUsers = ref('月')
const activeBtnOrders = ref('月')

// 圖片處理
const processImage = (path) => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  return baseUrl + path.replace(/^\//, '')
}

const top5Data = [
  {
    id: '1',
    name: '維他命C 1000mg',
    price: '180',
    star: '5',
    sales: '250',
    image: '/images/dashBoard/milk.png'
  },
  {
    id: '2',
    name: '晶亮葉黃素Plus (30粒)',
    price: '2450',
    star: '5',
    sales: '200',
    image: '/images/dashBoard/eye.png'
  },
  {
    id: '3',
    name: '紅麴納豆膠囊 (60粒)',
    price: '1600',
    star: '5',
    sales: '150',
    image: '/images/dashBoard/soy.png'
  },
]

</script>

<template>
  <div class="admin-layout">
    <adminHeader title="數據儀錶板" />
  </div>
  <section class="quan">
    <div v-for="quan in quanData" :key="quan.id" class="quan-card">
      <div class="title">
        {{ quan.title }}
      </div>
      <div class="quan-card__container">
        <span class="quan-card__value">
          {{ quan.value }}
        </span>
        <span v-if="quan.trend == 'up'" class='arrow-green'>&nbsp;▲</span>
        <span v-if="quan.trend == 'down'" class="arrow-red">&nbsp;▼</span>
      </div>
    </div>
  </section>
  <div class="main">
    <section class="trend">
      <div class="trend-card">
        <div class="trend__header">
          <span class="title">使用者成長趨勢</span>
          <span class="trend__period-select">
            <div class="period-select__btn" v-for="btn in periodBtn" :key="btn"
              :class="{ active: activeBtnUsers === btn }" @click="activeBtnUsers = btn">
              {{ btn }}
            </div>
          </span>
        </div>
        <div class="trend__container">
          <img src="/public/images/dashBoard/chart.png" alt="">
        </div>
      </div>
      <div class="trend-card">
        <div class="trend__header">
          <span class="title">訂單成長趨勢</span>
          <span class="trend__period-select">
            <div class="period-select__btn" v-for="btn in periodBtn" :key="btn"
              :class="{ active: activeBtnOrders === btn }" @click="activeBtnOrders = btn">
              {{ btn }}
            </div>
          </span>
        </div>
        <div class="trend__container">
          <img src="/public/images/dashBoard/chart.png" alt="">
        </div>
      </div>
    </section>
    <section class="top5">
      <div class="top5__header">
        <div class="title">熱銷商品</div>
      </div>
      <div class="top5__container">
        <div class="top5-card" v-for="product in top5Data" key="product.id">
          <div class="top5-card__title">TOP{{ product.id }}</div>
          <div class="top5-card__container">
            <div class="top5-card__img">
              <img :src="product.image" alt="">
            </div>
            <div class="top5-card__right">
              <div class="name">{{ product.name }}</div>
              <div class="price">${{ product.price }}</div>
              <div class="star">⭐⭐⭐⭐⭐</div>
              <div class="sales">月銷量 > {{ product.sales }}</div>
            </div>
          </div>
        </div>
      </div>

    </section>
  </div>

</template>
<style lang="scss" scoped>
.quan {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 20px;
  // border: solid 1px red;
  margin-bottom: 20px;
}

.quan-card {
  padding: 10px;
  // border: solid 1px;
  background-color: white;
}

.title {
  font-size: 14px;
  font-weight: 700;
  color: $primaryDark;
}

.quan-card__container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.quan-card__value {
  font-size: 30px;
  font-weight: 700;
}

.arrow-green {
  color: $primary;
}

.arrow-red {
  color: $accent;
}

.main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.trend {
  display: grid;
  grid-template-rows: 1fr 1fr;
  row-gap: 20px;
  // border: solid 1px red;
}

.trend-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: white;
}

.trend__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // border: solid 1px;
}

.trend__period-select {
  display: flex;
  border-radius: 5px;
  background-color: $primaryLight;
}

.period-select__btn {
  display: flex;
  justify-content: center;
  width: 50px;
  padding: 2px 0;
  border-radius: 5px;
  cursor: pointer;
}

.period-select__btn.active {
  color: white;
  background-color: $primaryDark;
}

.trend__container {
  height: auto;
  // border: solid 1px;
}
.trend__container img{
  height: 100%;
}

.top5 {
  // border: solid 1px red;
  background-color: white;
  padding: 10px;
}

.top5__header {
  margin-bottom: 10px;
}

.top5__container {
  display: grid;
  grid-template-rows: repeat(3,1fr);
  gap: 10px;
}

.top5-card {
  background-color: white;
  // border: solid 1px;
}

.top5-card__title {
  font-weight: 700;
}

.top5-card__container {
  display: flex;
  gap: 10px;
}

.top5-card__img {
  width: 150px;
  height: 150px;
  background-color: gray;
  img {
    object-fit: cover;
  }
}

.top5-card__right {
  width: calc(100% - 160px);
  // border: solid 1px blue;
}

.name {
  color: $primaryDark;
  font-size: 14px;
  font-weight: 700;
}

.price {
  font-size: 24px;
  font-weight: 700;
}

.star {
  padding-bottom: 10px;
}

.sales {
  padding-top: 10px;
  // border-top: solid 1px;
  font-size: 12px;
}
</style>
