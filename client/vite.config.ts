import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const SERVER_ORIGIN = process.env.PROD ? process.env.VITE_SERVER_ORIGIN : "http://localhost:8000";

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: SERVER_ORIGIN,
          changeOrigin: true,
        }
      }
    },
  })
}