import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'


export default defineConfig(({ mode }) => {
  // 讀取 .env、.env.[mode]，第三個參數用 '' 才會包含非 VITE_ 前綴
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      // 設定 SVG 圖標插件，指向你存放 svg 的目錄
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[name]',
      }),
    ],
    resolve: {
      alias: {
        // 統一使用 @ 代表 src 資料夾
        '@': path.resolve(__dirname, './src'),
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 自動注入全域變數，組員不必在每個組件手動 @import
          additionalData: `@import "@/assets/styles/_variables.scss"; @import "@/assets/styles/_mixins.scss";`,
          // 用來暫時屏蔽啟動localhost時的警告
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'if-function'],
        }
      }
    },
    base: env.VITE_BASE || '/',
    build: {
      outDir: env.VITE_OUT_DIR || 'dist',
    },
  }
})