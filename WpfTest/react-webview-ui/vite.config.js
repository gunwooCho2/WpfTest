import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173, // 기본 포트 설정 (WPF WebView2에서 접속할 주소)
        strictPort: true, // 포트가 사용 중일 때 자동으로 바꾸지 않게 설정
    }
})