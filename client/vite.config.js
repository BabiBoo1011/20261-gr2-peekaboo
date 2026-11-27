import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Khi chạy dev, chuyển các yêu cầu API và tệp mô hình sang server Express (cổng 3001)
const SERVER = 'http://localhost:3001'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': SERVER,
      '/models': SERVER,
      '/previews': SERVER,
    },
  },
})
