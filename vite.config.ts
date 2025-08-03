import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Si hay VITE_API_BASE_URL configurada, no usar proxy (apuntar directo al backend)
  const useProxy = !process.env.VITE_API_BASE_URL;
  
  console.log(`🔧 Vite config - Mode: ${mode}, Use Proxy: ${useProxy}`);
  if (!useProxy) {
    console.log(`🌐 API Base URL: ${process.env.VITE_API_BASE_URL}`);
  }

  return {
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    // Solo usar proxy si no hay VITE_API_BASE_URL configurada
    ...(useProxy && {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          configure: (proxy: any, _options: any) => {
            proxy.on('error', (err: any, _req: any, _res: any) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (_proxyReq: any, req: any, _res: any) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    }),
  },
  preview: {
    port: 3000,
    host: true,
  },
  };
})