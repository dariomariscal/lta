// Fuente única de verdad para la navegación del sitio.
// La usan tanto la barra de escritorio (Navbar) como el menú móvil (MobileMenu)
// para no duplicar la lista de enlaces.

export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/contacto', label: 'Contacto' },
];

/** Enlace destacado (CTA) que acompaña a la navegación. */
export const navCta = { href: '/contacto', label: 'Cotizar' };

/**
 * ¿El enlace corresponde a la ruta actual? La raíz solo coincide de forma
 * exacta; el resto coincide por prefijo (para subrutas como /servicios/x).
 */
export const isActive = (href: string, pathname: string): boolean =>
  href === '/' ? pathname === '/' : pathname.startsWith(href);
