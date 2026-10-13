# Integration / Entegrasyon

This project is buildless vanilla JavaScript. It needs no API key or runtime dependencies.

## Raw structured data

`data/terms.json` is an array. Each row has:

- `id`: stable English kebab-case identifier
- `category`: `bones`, `muscles`, `joints`, `directions`, `movements`, or `tissues`
- `en`, `tr`: primary names
- `latin`: optional Latin label
- `aliases`: alternate spellings and useful search synonyms
- `definition.en`, `definition.tr`: original brief definitions
- `sourceIds`: IDs resolving against `data/sources.json`

The words are educational reference content, not clinical or exercise recommendations. Keep source references and the educational disclaimer when integrating.

## Search module

```js
import { createSearchIndex, searchTerms, normalizeText } from './src/search.js';
const terms = await fetch('./data/terms.json').then(r => r.json());
const index = createSearchIndex(terms);
const result = searchTerms(index, {
  query: 'kurek kemigi',
  category: 'all', // optional
  lang: 'tr', // display-name sort language
  sort: 'relevance' // or 'alpha'
});
```

Search always covers both languages, Latin labels, aliases, and definitions. Every search token must match. Exact names rank above aliases and definitions. `lang` changes sorting, not the language searched. Turkish accents and dotted/dotless i are folded for search, while displayed text preserves correct spelling.

## Embed the UI

Copy `src/`, `data/`, and `assets/` to a stable path. Add the CSS and mount the component:

```html
<link rel="stylesheet" href="/glossary/src/styles.css">
<div id="anatomy"></div>
<script type="module">
  import { mountGlossary } from '/glossary/src/glossary.js';
  const glossary = await mountGlossary(document.querySelector('#anatomy'), {
    lang: 'tr',
    hero: false,
    syncUrl: false,
    documentLanguage: false
  });
  // glossary.setLanguage('en');
  // glossary.destroy();
</script>
```

Component CSS is scoped under `.anatomy-glossary`. It uses light color scheme. The sample standalone body style only applies to `body.standalone`. There is one global `:root { color-scheme: light; }` rule; remove it when embedding in a host that owns color schemes. The component supplies its own main/header/footer landmarks: normally embed one full glossary per page, or use the headless search module for custom host UI.

Options:

| Option | Default | Meaning |
|---|---|---|
| `lang` | `tr` | Initial UI language without URL sync |
| `hero` | `true` | Show introductory hero |
| `syncUrl` | `false` | Use query parameters and term hash; enable for one standalone instance only |
| `documentLanguage` | `false` | Update page language/title; standalone only |
| `dataUrl` | module-relative `../data/terms.json` | Override data location |
| `sourcesUrl` | module-relative `../data/sources.json` | Override reference location |
| `terms`, `sources` | fetched data | Supply already-loaded arrays |

`mountGlossary` resolves with `{ destroy(), setLanguage(lang) }`. Loading failures render a retry button. Do not pass untrusted arbitrary HTML; all dataset content is escaped, and source links are restricted to HTTPS.

## Deep links

The standalone app supports:

- `?q=scapula`
- `?lang=en&category=bones`
- `?q=kurek&sort=alpha#term=scapula`
- `#about`

IDs are taken from the dataset. Preserve them when editing translations so links stay valid. Search changes use `replaceState`; opening a detail adds a history entry so browser Back dismisses it. `syncUrl: false` leaves host-page URL/history alone.

## Hosting

Run `npm run build` and serve `dist/` on an HTTPS static host. Relative paths work at `/` or a project subpath such as `/yogarama-anatomy-glossary/`. No SPA fallback is needed; all deep links use query parameters and fragments. Hosting requires separate approval; no website deployment is included in the repository release.

Copy-to-clipboard needs HTTPS or localhost; if unavailable the UI explains that the term can be selected manually. Fetching JSON requires HTTP(S), so double-clicking `index.html` as `file://` is not supported.
