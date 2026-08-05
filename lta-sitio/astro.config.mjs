// @ts-check
import { defineConfig } from 'astro/config';

// Dominio canónico del sitio, resuelto en tiempo de build según el entorno.
//
// Como el sitio es estático, `Astro.url.origin` NO conoce el dominio real en
// producción/preview (todo se pre-renderiza), así que el único origen confiable
// del host son las variables de sistema que Vercel inyecta en el build:
//
//   - VERCEL_ENV                    → 'production' | 'preview' | 'development'
//   - VERCEL_PROJECT_PRODUCTION_URL → dominio de producción (sin https://)
//   - VERCEL_URL                    → dominio único de ESTE deploy (sin https://)
//
// Para que las previews muestren su propia URL (og:image/canonical apuntando al
// deploy real) usamos VERCEL_URL en preview, y el dominio de producción en prod.
// Fuera de Vercel (dev local, `astro build` local) caemos al dominio canónico.
const env = process.env;
const prodDomain = env.VERCEL_PROJECT_PRODUCTION_URL || 'grupolta.com';
const site =
  env.VERCEL_ENV === 'preview' && env.VERCEL_URL
    ? `https://${env.VERCEL_URL}`
    : `https://${prodDomain}`;

// https://astro.build/config
export default defineConfig({
  site,
  // Las imágenes del acervo ya vienen optimizadas (WebP, 3 anchos, color
  // corregido) y viven en public/img. No las reprocesamos con el servicio de
  // imágenes de Astro; se referencian con <img srcset> manual.
});
