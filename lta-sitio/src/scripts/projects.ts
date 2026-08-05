/* ============================================================================
   LTA · Proyectos — filtrado por sector
   Cada tarjeta enlaza a su página dedicada (/proyectos/[slug]); aquí solo se
   maneja el filtro. Estado activo vía aria-pressed y conteo en vivo (aria-live).
   ========================================================================== */

export function initProjects(): void {
  const grid = document.querySelector<HTMLElement>('[data-proj-grid]');
  if (!grid) return;

  const filtros = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const conteo = document.querySelector<HTMLElement>('[data-proj-count]');
  const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-proj-card]'));

  function aplicarFiltro(cat: string): void {
    let visibles = 0;
    cards.forEach((card) => {
      const match = cat === 'todos' || card.dataset.cat === cat;
      card.toggleAttribute('hidden', !match);
      if (match) visibles++;
    });
    if (conteo) {
      conteo.textContent = `${visibles} ${visibles === 1 ? 'proyecto' : 'proyectos'}`;
    }
  }

  filtros.forEach((btn) => {
    btn.addEventListener('click', () => {
      filtros.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      aplicarFiltro(btn.dataset.filter ?? 'todos');
    });
  });
}
