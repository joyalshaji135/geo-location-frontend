import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://geo-location-api-backend.onrender.com',
        changeOrigin: true,
        secure: false,

        // Configure proxy events
        // configure: (proxy, _options) => {

        //   // Proxy Error
        //   proxy.on('error', (err, _req, _res) => {
        //     console.log('Proxy Error:', err);
        //   });

        //   // Outgoing Request to Backend
        //   proxy.on('proxyReq', (_proxyReq, req, _res) => {
        //     console.log('➡️ Sending Request to Target:', req.method, req.url);
        //   });

        //   // Incoming Response from Backend
        //   proxy.on('proxyRes', (proxyRes, req, _res) => {
        //     console.log(
        //       '⬅️ Received Response from Target:',
        //       proxyRes.statusCode,
        //       req.url
        //     );
        //   });
        // },
      }
    }
  }
});
