import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Configuração para SPA no Netlify
  build: {
    outDir: 'dist',
    // Garante que os arquivos na pasta public sejam copiados
    assetsDir: 'assets',
  },
});
