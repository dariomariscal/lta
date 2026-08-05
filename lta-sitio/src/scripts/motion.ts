/* ============================================================================
   LTA · Motor de animación — "brutalismo cinético"
   GSAP + ScrollTrigger + Lenis. Ver enfoque en la conversación de diseño.

   Patrones:
   1. Lenis smooth scroll (base cinematográfica)
   2. Text reveal por líneas con máscara (la firma, en h1/h2 grandes)
   3. Clip-path image reveal (barrido recto, brutalista)
   4. Stagger de entrada en tarjetas / bloques
   5. Line-mask en la ficha técnica (valores que suben tras la regla del plano)
   6. Marquee infinito (logos, eyebrow) — CSS puro, aquí solo se respeta RM

   Todo se salta con prefers-reduced-motion: los elementos quedan visibles.
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initMotion(): void {
  if (reduceMotion) {
    // Sin animación: aseguramos estado visible por si el CSS no bastara.
    document.querySelectorAll<HTMLElement>('[data-reveal],[data-reveal-img],[data-reveal-text],[data-reveal-spec]')
      .forEach((el) => el.removeAttribute('style'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---- 1 · Lenis smooth scroll, sincronizado con ScrollTrigger ---- */
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anclas internas suaves
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      }
    });
  });

  /* ---- 2 · Text reveal por líneas con máscara ---- */
  // Envolvemos cada línea en un contenedor con overflow hidden y animamos
  // el .line-inner hacia arriba. Split simple por palabras dentro de líneas
  // no es trivial sin SplitText de pago; usamos un split por líneas basado en
  // el layout real medido tras el render.
  document.querySelectorAll<HTMLElement>('[data-reveal-text]').forEach((el) => {
    splitIntoLines(el);
    const inners = el.querySelectorAll<HTMLElement>('.line-inner');
    gsap.set(inners, { yPercent: 115 });
    gsap.to(inners, {
      yPercent: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  /* ---- 3 · Clip-path image reveal (barrido recto) ---- */
  document.querySelectorAll<HTMLElement>('[data-reveal-img]').forEach((el) => {
    gsap.to(el, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.1,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  /* ---- 4 · Stagger de entrada en bloques ---- */
  // Agrupa por contenedor [data-reveal-group] para escalonar sus hijos.
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal]');
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 82%' },
    });
  });
  // Bloques sueltos (fuera de un grupo)
  document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-group] [data-reveal])').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  /* ---- 5 · Line-mask en la ficha técnica ---- */
  document.querySelectorAll<HTMLElement>('[data-reveal-spec]').forEach((el) => {
    const values = el.querySelectorAll<HTMLElement>('.spec__v');
    gsap.to(values, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.06,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  /* ---- Refresh tras cargar fuentes (evita medidas de línea erróneas) ---- */
  if ('fonts' in document) {
    (document as Document & { fonts: FontFaceSet }).fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

/**
 * Parte el texto de un elemento en líneas visuales reales (según el wrap del
 * navegador) y envuelve cada una en <span class="line"><span class="line-inner">.
 * La línea externa recorta (overflow hidden) y la interna se anima.
 */
function splitIntoLines(el: HTMLElement): void {
  const text = el.textContent ?? '';
  const words = text.trim().split(/\s+/);
  el.textContent = '';

  // Colocamos cada palabra en un span temporal para medir su offsetTop.
  const wordSpans = words.map((w) => {
    const s = document.createElement('span');
    s.textContent = w;
    s.style.display = 'inline-block';
    el.appendChild(s);
    el.appendChild(document.createTextNode(' '));
    return s;
  });

  // Agrupamos palabras por su posición vertical (misma línea = mismo top).
  const lines: string[][] = [];
  let lastTop: number | null = null;
  wordSpans.forEach((s, i) => {
    const top = s.offsetTop;
    if (lastTop === null || top !== lastTop) {
      lines.push([]);
      lastTop = top;
    }
    lines[lines.length - 1].push(words[i]);
  });

  // Reconstruimos con la estructura de máscara.
  el.textContent = '';
  lines.forEach((line) => {
    const outer = document.createElement('span');
    outer.className = 'line';
    outer.style.display = 'block';
    outer.style.overflow = 'hidden';
    const inner = document.createElement('span');
    inner.className = 'line-inner';
    inner.textContent = line.join(' ');
    outer.appendChild(inner);
    el.appendChild(outer);
  });
}
