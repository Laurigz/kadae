import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, existsSync } from 'fs';

// Auto-detect generated product pages
const productPages = {};
const productosDir = resolve(__dirname, 'website/productos');
if (existsSync(productosDir)) {
  readdirSync(productosDir)
    .filter(f => f.endsWith('.html'))
    .forEach(f => {
      const key = 'prod_' + f.replace('.html', '').replace(/-/g, '_');
      productPages[key] = resolve(productosDir, f);
    });
}

export default defineConfig({
  root: 'website',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'website/index.html'),
        quienesSomos: resolve(__dirname, 'website/quienes-somos.html'),
        productos: resolve(__dirname, 'website/productos.html'),
        contacto: resolve(__dirname, 'website/contacto.html'),
        ...productPages,
      },
    },
  },
});
