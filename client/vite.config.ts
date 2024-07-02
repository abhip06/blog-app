import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const development: boolean = !process.env.MODE || process.env.MODE === 'development';
  const SERVER_ORIGIN = development ? "http://localhost:8000" : process.env.VITE_SERVER_ORIGIN;

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