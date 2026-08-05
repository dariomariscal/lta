// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://grupolta.com',
  // Las imágenes del acervo ya vienen optimizadas (WebP, 3 anchos, color
  // corregido) y viven en public/img. No las reprocesamos con el servicio de
  // imágenes de Astro; se referencian con <img srcset> manual.
});
