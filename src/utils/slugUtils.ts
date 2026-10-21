/**
 * Slug generator and unique collision resolver for Songs, Categories, Albums, Artists, and Tags.
 */

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start
    .replace(/-+$/, ''); // trim - from end
}

export function generateUniqueSlug(title: string, existingSlugs: string[], currentId?: string): string {
  const baseSlug = slugify(title) || 'track';
  let candidateSlug = baseSlug;
  let counter = 2;

  while (existingSlugs.includes(candidateSlug)) {
    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return candidateSlug;
}
