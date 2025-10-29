import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Cho phép truy cập từ mạng local
    port: 5173, // Cổng mặc định
    strictPort: false, // Tự động chuyển sang cổng khác nếu cổng này đang được sử dụng
  },
})
