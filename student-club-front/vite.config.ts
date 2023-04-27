import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import {
  AntDesignVueResolver
} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: 'less' })]
    })
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      },
    }
  },
  resolve: {
    alias: {
      "@const": path.resolve(__dirname, "src", "constant.ts"),
      "@comp": path.resolve(__dirname, "src", "components"),
      "@api": path.resolve(__dirname, "src", "api", "index.ts"),
      "@store": path.resolve(__dirname, "src", "store", "index.ts"),
      "@": path.resolve(__dirname, "src")
    }
  }
})
