import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',  // explicitly bind to localhost
    port: 5173,         // ensure port consistency
    hmr: {
      protocol: 'ws',   // websocket protocol
      host: 'localhost',
      port: 5173,
    }}
})
