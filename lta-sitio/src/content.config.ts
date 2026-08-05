import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Colección de proyectos — las 14 fichas del portafolio (lta-docs/docs/07).
 * Cada ficha alimenta la retícula y la ventana de detalle en /proyectos.
 * Los slugs de foto apuntan a los archivos reales del inventario, sin el
 * sufijo de tamaño ni la extensión (ej. "michoacan_tren-de-pavimentacion").
 */
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/proyectos' }),
  schema: z.object({
    orden: z.number(),
    nombre: z.string(),
    lugar: z.string(),
    cat: z.enum([
      'infraestructura',
      'hoteleria',
      'retail',
      'instalaciones',
      'mantenimiento',
      'topografia',
    ]),
    etiqueta: z.string(),
    alcance: z.string(),
    texto: z.string(),
    cta: z.string(),
    // Carpeta de sector dentro de public/img (ej. "01-infraestructura-carretera")
    sector: z.string(),
    // Slugs de foto; el primero es la imagen principal
    fotos: z.array(z.string()).min(1),
  }),
});

export const collections = { proyectos };
