<script setup>
import { ref } from 'vue'

const topIcons = ref([
  {
    // 鈴鐺標記有選單
    id: 'notice',
    name: '提醒',
    icon: 'notifications',
    path: false,
    badge: true,
    hasDropdown: true,
  },
  { name: '購物車', icon: 'shopping_cart', path: '/', badge: 100 },
  { name: '頭像', icon: 'account_circle', path: '/', badge: 0 },
])
// 個人通知假資料(正式要刪)
const notifications = ref([
  {
    id: 1,
    type: 'order',
    title: '訂單出貨通知',
    content: '您的訂單 #20260106 已由物流配送中。',
    time: '10 分鐘前',
    isRead: false, // 預設為未讀
  },
  {
    id: 2,
    type: 'health',
    title: '服藥提醒',
    content: '該吃降血壓藥囉！請記得搭配溫開水服用。',
    time: '1 小時前',
    isRead: true, // 預設為已讀
  },
])
const isDropdownOpen = ref(false) // 控制選單顯示
</script>
<template>
  <!-- 頂部icon -->
  <div class="global-top-bar">
    <div
      v-for="item in topIcons"
      :key="item.name"
      class="icon-circle"
      @click="$router.push(item.path)"
      @mouseenter="item.id === 'notice' ? (isDropdownOpen = true) : null"
      @mouseleave="isDropdownOpen = false"
    >
      <span class="material-icons">{{ item.icon }}</span>
      <!-- 數字紅點 -->
      <div v-if="typeof item.badge === 'number' && item.badge > 0" class="badge-number">
        {{ item.badge > 99 ? '99+' : item.badge }}
      </div>
      <!-- 僅紅點 -->
      <div v-else-if="item.badge === true" class="badge-dot"></div>
      <!-- 個人通知清單 -->
      <Transition name="fade">
        <div
          v-if="item.id === 'notice' && isDropdownOpen"
          class="notification-dropdown"
          @click.stop
        >
          <div class="dropdown-header">通知</div>
          <ul class="dropdown-list">
            <li
              v-for="note in notifications"
              :key="note.id"
              :class="{ 'is-read': note.isRead }"
              @click="note.isRead = true"
            >
              <div class="note-title">{{ note.title }}</div>
              <div class="note-content">{{ note.content }}</div>
              <div class="note-time">{{ note.time }}</div>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>
<style lang="scss" scoped>
// 頂部icon
.global-top-bar {
  display: flex;
  margin-bottom: 16px;
  justify-content: end;
  gap: 12px;
  margin-bottom: 20px; //與下方物件的距離
}
.icon-circle {
  //   border: 1px solid black;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  box-shadow: $shadow;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.material-icons {
  color: $primaryDark;
}
// 提醒紅點
.badge-number {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: $accent;
  color: white;
  font-size: 10px; // 自設
  font-family: 'noto sans TC'; // 參考設計規範
  font-weight: bold;
  min-width: 18px;
  height: 18px;
  border-radius: $radius_md;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: $shadow;
}
.badge-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: $accent;
  min-width: 15px;
  height: 15px;
  border-radius: $radius_md;
}
// 個人通知選單樣式
.notification-dropdown {
  position: absolute;
  top: 50px; // 在 icon 下方
  right: 0;
  width: 350px;
  background: $accentLight;
  border-radius: $radius_md;
  box-shadow: $shadowDark;
  // padding: 15px;
  z-index: 100;

  .dropdown-header {
    color: $white;
    background-color: $primaryDark;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    padding: 10px;
    // margin-bottom: 8px;
  }

  .dropdown-list {
    list-style: none;
    padding: 0px;
    font-size: 14px;

    li {
      // 未讀訊息樣式
      padding: 5px;
      border-bottom: 1px dashed #f0f0f0;
      &:last-child {
        border: none;
      }
      // 點選後的樣式
      &.is-read {
        padding: 5px;
        background-color: $white;
        color: $grayDark;
        cursor: default;
      }
    }
  }
}

// 選單動畫
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
