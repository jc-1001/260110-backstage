<script setup>
import AdminHeader from '@/components/admin/adminHeader.vue'
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import { Chart, registerables } from 'chart.js'
import milkImg from '@/assets/images/dashboard/milk.png'
import eyeImg from '@/assets/images/dashBoard/eye.png'
import soyImg from '@/assets/images/dashBoard/soy.png'

// 注册 Chart.js 所有组件
Chart.register(...registerables)

const API_BASE_URL = 'http://localhost:8888/unicare_api/dashboard'

const memberStats = ref({
  total: 0,
  newThisMonth: 0,
})

const orderStats = ref({
  today: 0,
  pending: 0,
  thisMonth: 0,
  total: 0,
  statusDistribution: {},
  monthlyRevenue: 0
})

// 🔥 新增：图表相关
const userChartCanvas = ref(null)
const orderChartCanvas = ref(null)
let userChartInstance = null
let orderChartInstance = null

// 取得會員統計
const getMemberStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_member_stats.php`)

    if (response.data.success) {
      const data = response.data.data

      memberStats.value = {
        total: data.total_members,
        newThisMonth: data.new_members_this_month,
      }
      console.log('✅ 會員統計:', memberStats.value)
    }
  } catch (error) {
    console.error('❌ 取得會員統計失敗:', error)
  }
}

// 取得訂單統計
const getOrderStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get_order_stats.php`)

    if (response.data.success) {
      const data = response.data.data

      orderStats.value = {
        today: data.orders_today,
        pending: data.orders_pending,
      }
      console.log('✅ 訂單統計:', orderStats.value)
    }
  } catch (error) {
    console.error('❌ 取得訂單統計失敗:', error)
  }
}

// 🔥 修改：取得使用者趨勢數據
const getMemberTrends = async (period) => {
  try {
    const periodMap = {
      '月': 'month',    // 30天
      '季': 'quarter',  // 90天
      '年': 'year'      // 365天
    }
    
    const response = await axios.get(`${API_BASE_URL}/get_member_trends.php`, {
      params: { period: periodMap[period] }
    })

    if (response.data.success) {
      console.log(`✅ ${period} 使用者趨勢:`, response.data.data)
      return response.data.data
    }
  } catch (error) {
    console.error('❌ 取得使用者趨勢失敗:', error)
    return { labels: [], values: [] }
  }
}

// 🔥 新增：取得訂單趨勢數據
// 🔥 修改：取得訂單趨勢數據
const getOrderTrends = async (period) => {
  try {
    const periodMap = {
      '月': 'month',    // 30天
      '季': 'quarter',  // 90天
      '年': 'year'      // 365天
    }
    
    const response = await axios.get(`${API_BASE_URL}/get_order_trends.php`, {
      params: { period: periodMap[period] }
    })

    if (response.data.success) {
      console.log(`✅ ${period} 訂單趨勢:`, response.data.data)
      return response.data.data
    }
  } catch (error) {
    console.error('❌ 取得訂單趨勢失敗:', error)
    return { labels: [], values: [] }
  }
}

// 🔥 新增：初始化使用者成長圖表
const initUserChart = async () => {
  if (!userChartCanvas.value) return

  const trendData = await getMemberTrends(activeBtnUsers.value)

  // 銷毀舊圖表
  if (userChartInstance) {
    userChartInstance.destroy()
  }

  const ctx = userChartCanvas.value.getContext('2d')

  userChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendData.labels,
      datasets: [{
        label: '新增使用者數',
        data: trendData.values,
        borderColor: '#2E6669',
        backgroundColor: 'rgba(46, 102, 105, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#2E6669',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toFixed(0)
            }
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  })
}

// 🔥 新增：初始化訂單成長圖表
const initOrderChart = async () => {
  if (!orderChartCanvas.value) return

  const trendData = await getOrderTrends(activeBtnOrders.value)

  // 銷毀舊圖表
  if (orderChartInstance) {
    orderChartInstance.destroy()
  }

  const ctx = orderChartCanvas.value.getContext('2d')

  orderChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendData.labels,
      datasets: [{
        label: '訂單數量',
        data: trendData.values,
        borderColor: '#E74C3C',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#E74C3C',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toFixed(0)
            }
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  })
}

const periodBtn = ['月', '季', '年']
const activeBtnUsers = ref('月')
const activeBtnOrders = ref('月')

// 在 mounted 時呼叫
onMounted(async () => {
  await getMemberStats()
  await getOrderStats()
  
  // 🔥 等待 DOM 渲染完成後初始化圖表
  await nextTick()
  await initUserChart()
  await initOrderChart()
})

// 🔥 監聽使用者按鈕變化
watch(activeBtnUsers, async () => {
  await nextTick()
  await initUserChart()
})

// 🔥 監聽訂單按鈕變化
watch(activeBtnOrders, async () => {
  await nextTick()
  await initOrderChart()
})

const quanData = computed(() => [
  {
    id: "members-number",
    title: "使用者總數",
    value: memberStats.value.total,
  },
  {
    id: "members-increase",
    title: "本月增加使用者",
    value: memberStats.value.newThisMonth,
    trend: memberStats.value.newThisMonth > 0 ? "up" : "down",
  },
  {
    id: "orders-today",
    title: "今日訂單數量",
    value: orderStats.value.today,
    trend: orderStats.value.today > 0 ? "up" : "down",
  },
  {
    id: "orders-pending",
    title: "待處理訂單數量",
    value: orderStats.value.pending,
  },
])

const top5Data = [
  {
    id: '1',
    name: '維他命C 1000mg',
    price: '180',
    star: '5',
    sales: '250',
    image: milkImg
  },
  {
    id: '2',
    name: '晶亮葉黃素Plus (30粒)',
    price: '2450',
    star: '5',
    sales: '200',
    image: eyeImg
  },
  {
    id: '3',
    name: '紅麴納豆膠囊 (60粒)',
    price: '1600',
    star: '5',
    sales: '150',
    image: soyImg
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
      <!-- 🔥 使用者成長趨勢 -->
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
          <!-- 🔥 改成 canvas -->
          <canvas ref="userChartCanvas"></canvas>
        </div>
      </div>
      
      <!-- 🔥 訂單成長趨勢 -->
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
          <!-- 🔥 改成 canvas -->
          <canvas ref="orderChartCanvas"></canvas>
        </div>
      </div>
    </section>
    <section class="top5">
      <div class="top5__header">
        <div class="title">熱銷商品</div>
      </div>
      <div class="top5__container">
        <div class="top5-card" v-for="product in top5Data" :key="product.id">
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
  margin-bottom: 20px;
}

.quan-card {
  padding: 10px;
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
  transition: ease 0.2s;
}

.period-select__btn.active {
  color: white;
  background-color: $primaryDark;
}

.trend__container {
  /* 🔥 修改：設定固定高度讓圖表正常顯示 */
  height: 250px;
  position: relative;
}

.top5 {
  background-color: white;
  padding: 10px;
}

.top5__header {
  margin-bottom: 10px;
}

.top5__container {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
}

.top5-card {
  background-color: white;
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

.top5-card__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.top5-card__right {
  width: calc(100% - 160px);
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
  font-size: 12px;
}
</style>