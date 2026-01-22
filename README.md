# 後台 README

## [FIGMA](https://www.figma.com/design/X78x31tK2e6S5C17o5cA0N/%E5%9C%98%E9%AB%94%E5%B0%88%E9%A1%8C%E8%A8%AD%E8%A8%88%E6%AD%A3%E5%BC%8F-%E5%A4%9A%E9%A0%81%E9%9D%A2-?node-id=0-3&t=zSXHFTp5cfmQ1esO-1)

## [我們的簡報]()

## 頁面大致分布

```text
src/
├── api/                        # API 請求層 (依模組與權限分組)
│   ├── auth.js                 # 登入、註冊、權限校驗
│   └── admin/                  # 後台 11 頁 API (如: updateUserStatus, uploadProduct)
├── assets/                     # 靜態資源管理
│   ├── images/                 # 靜態圖片
│   │   ├── public/             # Landing Page 用的形象大圖、Hero Banner
│   │   ├── admin/              # 後台專用圖標 (如：數據分析插圖 icon)
│   │   └── common/             # 全站共用 (Logo, 預設頭像, 404 圖片)
│   ├── icons/                  # 存放所有原始 .svg 檔案
│   └── styles/                 # 樣式管理
│       ├── _variables.scss     # 顏色與斷點變數
│       ├── _mixins.scss        # 常用 CSS 技巧 (如: 垂直置中)
│       ├── _base.scss          # 基礎重置：Reset CSS、全域標籤樣式
│       ├── _layouts.scss       # 外殼樣式：AdminLayout 的框架佈局
│       ├── _components.scss    # 跨頁面小組件樣式
│       └── main.scss           # 入口 CSS (匯總以上所有檔案)
├── components/                 # 組件封裝層 (依複用性分層)
│   ├── common/                 # 【全站通用】前後台皆可呼叫
│   │   ├── icons/
│   │   │   └── SvgIcon.vue     # 全域 SVG 圖標組件
│   │   ├── charts/             # --- 大量圖表組件 ---
│   │   │   ├── BaseChart.vue   # 封裝 ECharts 基礎 (含 RWD Resize)
│   │   │   ├── VitalsChart.vue # 身體數據折線圖 (前後台共用)
│   │   │   └── RatioChart.vue  # 飲食比例圓餅圖
│   │   └── modals/             # --- 全站共用燈箱 ---
│   │       └── ConfirmBox.vue  # 全域確認彈窗 (如: 確定刪除嗎?)
│   └── admin/                  # 【後台專屬組件】(如: 管理表格、數據看板卡片)
├── data/                       # 物件資料 (Mock Data)，用於初期開發展示
├── hooks/                      # 組合式邏輯 (Composition API)
│   └── useChart.js             # 封裝圖表初始化與銷毀邏輯
├── layouts/                    # 佈局外殼 (決定頁面框架)
│   └── AdminLayout.vue         # 後台系統佈局 (含 Sidebar, Breadcrumbs)
├── router/                     # 路由設定
│   ├── index.js                # 主控台 (含 beforeEach 權限守衛)
│   └── public.js               # 導航: Landing, Portal, Auth
├── stores/                     # Pinia 狀態管理
│   ├── user.js                 # 用戶角色(Admin/User)、Token、積分
│   ├── cart.js                 # 購物車列表、總金額計算
│   └── ui.js                   # 全域燈箱狀態、RWD 選單開關
├── views/                      # 頁面入口 (View 組件)
│   ├── BackDashboard.vue       # 1. 數據儀表板
│   ├── users/                  # --- 使用者管理子模組 ---
│   │   ├── UserList.vue        # 2. 使用者管理 (列表)
│   │   └── UserDetail.vue      # 3. 使用者詳細資訊
│   ├── products/               # --- 商品管理子模組 ---
│   │   ├── ProductList.vue     # 4. 商品管理 (列表)
│   │   └── ProductEdit.vue     # 5. 編輯商品資訊
│   ├── orders/                 # --- 訂單管理子模組 ---
│   │   ├── OrderList.vue       # 6. 訂單管理 (列表)
│   │   └── OrderDetail.vue     # 7. 訂單詳細資訊
│   └── notices/                # --- 系統通知子模組 ---
│       ├── NoticeList.vue      # 8. 系統通知 (列表)
│       └── NoticeEdit.vue      # 9. 編輯系統通知
├── App.vue                     # 根組件
└── main.js                     # 專案初始化
```
