import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import dotenv from 'dotenv';
import {fileURLToPath, URL} from "node:url";
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/': {
        target: `${process.env.HOST}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    host: '0.0.0.0',
    port: 5173,
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('box-'),
      },
    },
  }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
