/** Language-agnostic search primitives. No DOM or external dependencies. */
export const CATEGORIES = Object.freeze(['bones', 'muscles', 'joints', 'directions', 'movements', 'tissues']);

/** Treat Turkish dotted/dotless i and accents equivalently when searching. */
export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function createSearchIndex(terms) {
  return terms.map(term => {
    const names = [term.en, term.tr, term.latin ?? ''].map(normalizeText).filter(Boolean);
    const aliases = (term.aliases ?? []).map(normalizeText);
    const description = normalizeText(`${term.definition.en} ${term.definition.tr}`);
    return { term, names, aliases, searchable: [...names, ...aliases, description].join(' ') };
  });
}

/** AND-token search across both languages. Exact names rank before descriptions. */
export function searchTerms(index, { query = '', category = 'all', lang = 'tr', sort = 'relevance' } = {}) {
  const normalized = normalizeText(query);
  const tokens = normalized.split(' ').filter(Boolean);
  const collator = new Intl.Collator(lang === 'en' ? 'en' : 'tr', { sensitivity: 'base' });
  return index
    .filter(row => (category === 'all' || row.term.category === category) && tokens.every(token => row.searchable.includes(token)))
    .map(row => ({ term: row.term, score: !normalized ? 0 :
      row.names.includes(normalized) ? 100 :
      row.aliases.includes(normalized) ? 90 :
      row.names.some(name => name.startsWith(normalized)) ? 75 :
      row.names.some(name => name.includes(normalized)) ? 60 :
      row.aliases.some(alias => alias.includes(normalized)) ? 40 : 10 }))
    .sort((a, b) => (sort === 'relevance' ? b.score - a.score : 0) || collator.compare(a.term[lang === 'en' ? 'en' : 'tr'], b.term[lang === 'en' ? 'en' : 'tr']))
    .map(row => row.term);
}

/** Validate the reusable dataset; returns all problems rather than failing early. */
export function validateTerms(terms, sources = []) {
  const errors = [];
  if (!Array.isArray(terms)) return ['Terms must be an array.'];
  const ids = new Set();
  const sourceIds = new Set(sources.map(source => source.id));
  for (const [i, term] of terms.entries()) {
    const label = term?.id ?? `row ${i}`;
    if (!term || typeof term !== 'object') { errors.push(`Invalid ${label}`); continue; }
    if (typeof term.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(term.id)) errors.push(`Invalid id: ${label}`);
    if (ids.has(term.id)) errors.push(`Duplicate id: ${label}`);
    ids.add(term.id);
    if (!CATEGORIES.includes(term.category)) errors.push(`Invalid category: ${label}`);
    for (const lang of ['en', 'tr']) {
      if (typeof term[lang] !== 'string' || !term[lang].trim()) errors.push(`Missing ${lang} name: ${label}`);
      if (typeof term.definition?.[lang] !== 'string' || !term.definition[lang].trim()) errors.push(`Missing ${lang} definition: ${label}`);
    }
    if (!Array.isArray(term.aliases) || term.aliases.some(alias => typeof alias !== 'string')) errors.push(`Invalid aliases: ${label}`);
    if (!Array.isArray(term.sourceIds) || !term.sourceIds.length) errors.push(`Missing sources: ${label}`);
    else for (const id of term.sourceIds) if (!sourceIds.has(id)) errors.push(`Unknown source ${id}: ${label}`);
  }
  return errors;
}
