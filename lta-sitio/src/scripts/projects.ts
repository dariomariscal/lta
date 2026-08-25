/* ============================================================================
   LTA · Proyectos — filtrado por sector
   Cada tarjeta enlaza a su página dedicada (/proyectos/[slug]); aquí solo se
   maneja el filtro. Estado activo vía aria-pressed y rótulo en vivo (aria-live).
   LTA no comunica un número de obras: el rótulo es cualitativo, sin cifras.
   ========================================================================== */

export function initProjects(): void {
  const grid = document.querySelector<HTMLElement>('[data-proj-grid]');
  if (!grid) return;

  const filtros = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const rotulo = document.querySelector<HTMLElement>('[data-proj-count]');
  const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-proj-card]'));

  function aplicarFiltro(btn: HTMLButtonElement): void {
    const cat = btn.dataset.filter ?? 'todos';
    cards.forEach((card) => {
      const match = cat === 'todos' || card.dataset.cat === cat;
      card.toggleAttribute('hidden', !match);
    });
    if (rotulo) {
      rotulo.textContent =
        cat === 'todos'
          ? 'Una muestra de nuestro trabajo'
          : `Una muestra en ${btn.textContent?.trim()}`;
    }
  }

  filtros.forEach((btn) => {
    btn.addEventListener('click', () => {
      filtros.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      aplicarFiltro(btn);
    });
  });
}
