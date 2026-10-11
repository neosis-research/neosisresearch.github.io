/** Convergent Fields: three curved disciplines opening onto a shared question. */
const field =
  'M38 8C59-1 79 10 82 32C85 52 73 69 55 78L51 77C65 58 65 31 54 17C47 8 37 6 31 15C25 23 24 29 23 33L12 39C15 24 24 12 38 8Z';
// Local mask cuts preserve genuine transparency in every color/background use.
export function brandMarkup(id, compact = false) {
  const gap = compact ? 2.3 : 1.7;
  return `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="120"><rect x="-10" y="-10" width="120" height="120" fill="white"/><path d="${field}" transform="rotate(120 50 50)" fill="black" stroke="black" stroke-width="${gap}" stroke-linejoin="round"/></mask></defs>${[0, 120, 240].map((angle) => `<g transform="rotate(${angle} 50 50)"><path d="${field}" fill="currentColor" mask="url(#${id})"/></g>`).join('')}`;
}
