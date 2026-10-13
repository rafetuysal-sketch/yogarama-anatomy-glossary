import { CATEGORIES, createSearchIndex, searchTerms, validateTerms } from './search.js';

const COPY = {
  tr: {
    title: 'Anatomi Sözlüğü', nav: 'Sözlük', about: 'Kaynaklar ve notlar', eyebrow: 'ASANA LAB · ÖĞRENME KÜTÜPHANESİ',
    hero: 'Bedeni tanı.<br>Hareketi anla.', intro: 'Anatominin dilini birlikte keşfedelim. Yoga pratiğine eşlik eden temel terimler, Türkçe ve İngilizce bir arada.',
    stamp: 'İki dil.<br>Tek bir beden.', terms: 'temel terim', categories: 'kategori', search: 'Bir terim keşfet', placeholder: 'Türkçe veya İngilizce ara…', hint: 'Örneğin: kürek kemiği, scapula, fleksiyon',
    clear: 'Aramayı temizle', all: 'Tüm terimler', results: 'terim', sort: 'Sıralama', relevance: 'İlgili sonuçlar', alpha: 'A–Z', browse: 'SÖZLÜĞÜ KEŞFET',
    open: 'Terimi incele', empty: 'Bu terimi henüz bulamadık.', emptyBody: 'Başka bir yazım deneyin veya kategori filtresini kaldırın. Türkçe karakter kullanmanız gerekmiyor.', reset: 'Tüm terimleri göster',
    educational: 'Öğrenmek için bir başlangıç.', disclaimer: 'Bu sözlük genel eğitim içindir; tanı, tedavi veya kişisel egzersiz önerisi sunmaz. Ağrı ya da sağlıkla ilgili sorularınızda yetkin bir sağlık uzmanına danışın.',
    footer: 'Hareketi merakla öğren.', close: 'Kapat', translation: 'İngilizce', latin: 'Latince', aliases: 'Diğer adlar ve arama terimleri', source: 'Kaynaklar', copy: 'Terimi kopyala', copied: 'Kopyalandı', copyFailed: 'Kopyalama kullanılamıyor. Metni seçerek kopyalayabilirsiniz.',
    noteTitle: 'Küçük bir sözlük, sağlam bir temel.', note: 'Terimler ve kısa açıklamalar bu proje için özgün olarak hazırlanmıştır. Kaynaklar anatomik kavramları ve terminolojiyi kontrol etmek için kullanılmıştır; kaynak metinler veya görseller yeniden yayımlanmamıştır.',
    note2: 'Türkçe karşılıklar bağlama ve eğitim geleneğine göre değişebilir. Anatomik yönler, aksi belirtilmedikçe standart anatomik pozisyona göre tanımlanır. Bu ilk sürüm bağımsız uzman incelemesinden geçmemiştir.',
    data: 'Terim verisini indir (JSON)', loading: 'Sözlük yükleniyor…', error: 'Sözlük yüklenemedi.', errorBody: 'Sayfayı yenileyin. Dosyaları yerel olarak açıyorsanız README içindeki yerel sunucu adımlarını izleyin.', retry: 'Yeniden dene', skip: 'Terimlere geç', keyboard: 'Ara',
    category: { bones: 'Kemikler', muscles: 'Kaslar', joints: 'Eklemler', directions: 'Yönler ve düzlemler', movements: 'Hareketler', tissues: 'Dokular' }
  },
  en: {
    title: 'Anatomy Glossary', nav: 'Glossary', about: 'Sources & notes', eyebrow: 'ASANA LAB · LEARNING LIBRARY',
    hero: 'Know the body.<br>Understand movement.', intro: 'Explore the language of anatomy. Essential terms to accompany your yoga learning, in English and Turkish together.',
    stamp: 'Two languages.<br>One body.', terms: 'core terms', categories: 'categories', search: 'Discover a term', placeholder: 'Search in English or Turkish…', hint: 'Try: shoulder blade, scapula, fleksiyon',
    clear: 'Clear search', all: 'All terms', results: 'terms', sort: 'Sort by', relevance: 'Most relevant', alpha: 'A–Z', browse: 'EXPLORE THE GLOSSARY',
    open: 'Explore term', empty: 'We haven’t found that term yet.', emptyBody: 'Try a different spelling or remove the category filter. Turkish accents are optional when searching.', reset: 'Show all terms',
    educational: 'A starting point for learning.', disclaimer: 'This glossary is for general education. It does not provide diagnosis, treatment, or personal exercise advice. Consult a qualified healthcare professional about pain or health concerns.',
    footer: 'Stay curious about movement.', close: 'Close', translation: 'Turkish', latin: 'Latin', aliases: 'Other names & search terms', source: 'Sources', copy: 'Copy term', copied: 'Copied', copyFailed: 'Copy is unavailable. You can select and copy the text instead.',
    noteTitle: 'A small glossary. A solid foundation.', note: 'The terms and short explanations were written originally for this project. Sources were consulted to check anatomical concepts and terminology; their text and illustrations are not republished.',
    note2: 'Turkish equivalents can vary by context and teaching tradition. Directions refer to standard anatomical position unless stated otherwise. This initial edition has not undergone independent expert review.',
    data: 'Download terms (JSON)', loading: 'Loading the glossary…', error: 'The glossary could not be loaded.', errorBody: 'Refresh the page. If you opened the files directly, follow the local server instructions in the README.', retry: 'Try again', skip: 'Skip to terms', keyboard: 'Search',
    category: { bones: 'Bones', muscles: 'Muscles', joints: 'Joints', directions: 'Directions & planes', movements: 'Movements', tissues: 'Tissues' }
  }
};
const ICON = {
  search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M15 8V4H4v11h4"/></svg>',
  mark: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="23" r="16"/><path d="M8 32h32M24 7v32M12 13l24 21M36 13 12 34"/></svg>'
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
let instance = 0;

/**
 * Mount the standalone glossary or an embedded instance.
 * Defaults resolve data relative to this module, so subdirectory hosting works.
 * Returns { destroy(), setLanguage(lang) }. No tracking, storage, or runtime dependencies.
 */
export async function mountGlossary(target, options = {}) {
  if (!(target instanceof HTMLElement)) throw new TypeError('mountGlossary requires an HTML element.');
  const id = `glossary-${++instance}`;
  const controller = new AbortController();
  const { signal } = controller;
  const dataUrl = options.dataUrl ?? new URL('../data/terms.json', import.meta.url);
  const sourcesUrl = options.sourcesUrl ?? new URL('../data/sources.json', import.meta.url);
  const syncUrl = options.syncUrl === true;
  let lang = options.lang === 'en' ? 'en' : 'tr';
  let query = '', category = 'all', sort = 'relevance', openKey = null, copyTimer;
  let lastTrigger = null;
  target.classList.add('anatomy-glossary');
  target.innerHTML = `<p class="initial-loading" role="status">${COPY[lang].loading}</p>`;
  let terms, sources;
  try {
    [terms, sources] = await Promise.all([
      options.terms ?? fetch(dataUrl, { signal }).then(response => { if (!response.ok) throw Error(`Terms: ${response.status}`); return response.json(); }),
      options.sources ?? fetch(sourcesUrl, { signal }).then(response => { if (!response.ok) throw Error(`Sources: ${response.status}`); return response.json(); })
    ]);
    const errors = validateTerms(terms, sources);
    if (errors.length) throw Error(errors.join('\n'));
  } catch (error) {
    if (error.name === 'AbortError') return { destroy() {} };
    target.innerHTML = `<section class="load-error" role="alert"><h1>${COPY[lang].error}</h1><p>${COPY[lang].errorBody}</p><button type="button">${COPY[lang].retry}</button></section>`;
    target.querySelector('button').addEventListener('click', () => { controller.abort(); mountGlossary(target, options); }, { once: true });
    console.error('Glossary loading failed:', error);
    return { destroy() { controller.abort(); target.replaceChildren(); } };
  }
  const index = createSearchIndex(terms);
  const byId = new Map(terms.map(term => [term.id, term]));
  const bySource = new Map(sources.map(source => [source.id, source]));
  const counts = Object.fromEntries(CATEGORIES.map(key => [key, terms.filter(term => term.category === key).length]));
  const $ = selector => target.querySelector(selector);
  const currentCopy = () => COPY[lang];

  function readUrl() {
    if (!syncUrl) return;
    const url = new URL(location.href);
    lang = url.searchParams.get('lang') === 'en' ? 'en' : 'tr';
    query = (url.searchParams.get('q') ?? '').slice(0, 300);
    category = CATEGORIES.includes(url.searchParams.get('category')) ? url.searchParams.get('category') : 'all';
    sort = url.searchParams.get('sort') === 'alpha' ? 'alpha' : 'relevance';
  }
  function writeUrl() {
    if (!syncUrl) return;
    const url = new URL(location.href);
    for (const [key, value] of Object.entries({ lang: lang === 'en' ? 'en' : '', q: query, category: category === 'all' ? '' : category, sort: sort === 'alpha' ? 'alpha' : '' })) {
      if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    }
    history.replaceState(history.state, '', url);
  }
  function sourcesHtml(ids) {
    return ids.map(sourceId => bySource.get(sourceId)).filter(Boolean).map(source => {
      let safe = false;
      try { safe = new URL(source.url).protocol === 'https:'; } catch { /* Invalid URLs stay plain text. */ }
      return `<li>${safe ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} <span aria-hidden="true">↗</span></a>` : esc(source.title)}<span class="source-org">${esc(source.organization)}</span></li>`;
    }).join('');
  }
  function drawShell() {
    const t = currentCopy();
    if (options.documentLanguage) {
      document.documentElement.lang = lang;
      document.title = `${t.title} · Yogarama / Asana Lab`;
    }
    target.lang = lang;
    target.innerHTML = `
      <a class="skip-link" href="#${id}-terms">${t.skip}</a>
      <header class="site-header wrap">
        <a class="brand" href="${syncUrl ? location.pathname : '#'}" aria-label="Yogarama / Asana Lab">${ICON.mark}<span>yogarama<span class="brand-sub">ASANA LAB</span></span></a>
        <div class="header-right"><button type="button" class="about-link" data-about>${t.about}</button><div class="language-switch" role="group" aria-label="Language / Dil"><button type="button" data-language="tr" lang="tr" aria-label="Türkçe" aria-pressed="${lang === 'tr'}">TR</button><button type="button" data-language="en" lang="en" aria-label="English" aria-pressed="${lang === 'en'}">EN</button></div></div>
      </header>
      <main>
        ${options.hero === false ? '' : `<section class="hero wrap" aria-labelledby="${id}-title"><div class="hero-copy"><p class="eyebrow"><span></span>${t.eyebrow}</p><h1 id="${id}-title">${t.hero}</h1><p class="intro">${t.intro}</p></div><div class="hero-art" aria-hidden="true"><svg viewBox="0 0 330 240" fill="none"><ellipse cx="172" cy="119" rx="118" ry="73" transform="rotate(-40 172 119)"/><ellipse cx="172" cy="119" rx="118" ry="73" transform="rotate(40 172 119)"/><ellipse cx="172" cy="119" rx="79" ry="113"/><circle cx="252" cy="51" r="5"/></svg><p>${t.stamp}</p><span>EN <span>↔</span> TR</span></div></section>`}
        <section class="workspace wrap" aria-label="${t.title}">
          <div class="search-panel"><div class="search-heading"><label for="${id}-search">${t.search}</label><span>${terms.length} ${t.terms} <span class="middot">·</span> ${CATEGORIES.length} ${t.categories}</span></div>
            <div class="search-field">${ICON.search}<input id="${id}-search" type="search" maxlength="300" autocomplete="off" spellcheck="false" placeholder="${t.placeholder}" value="${esc(query)}" aria-describedby="${id}-hint"><button type="button" class="clear-search icon-button" data-clear aria-label="${t.clear}" ${query ? '' : 'hidden'}>${ICON.close}</button><kbd aria-hidden="true">/</kbd></div>
            <p class="search-hint" id="${id}-hint">${t.hint}</p>
          </div>
          <div class="category-list" role="group" aria-label="${lang === 'tr' ? 'Kategori filtresi' : 'Category filter'}"><button type="button" data-category="all" aria-pressed="${category === 'all'}">${t.all}<span>${terms.length}</span></button>${CATEGORIES.map(key => `<button type="button" data-category="${key}" aria-pressed="${category === key}">${t.category[key]}<span>${counts[key]}</span></button>`).join('')}</div>
          <div class="results-toolbar"><div><p class="eyebrow">${t.browse}</p><p class="result-count" role="status" aria-live="polite" aria-atomic="true"></p></div><label class="sort-control">${t.sort}<select data-sort aria-label="${t.sort}"><option value="relevance" ${sort === 'relevance' ? 'selected' : ''}>${t.relevance}</option><option value="alpha" ${sort === 'alpha' ? 'selected' : ''}>${t.alpha}</option></select></label></div>
          <div id="${id}-terms" class="term-grid" tabindex="-1"></div>
        </section>
        <aside class="education-note wrap"><span class="note-symbol" aria-hidden="true">i</span><div><h2>${t.educational}</h2><p>${t.disclaimer}</p></div></aside>
      </main>
      <footer class="site-footer wrap"><span>Yogarama <span class="footer-slash">/</span> Asana Lab</span><span>${t.footer}</span><button type="button" data-about>${t.about} ↗</button></footer>
      <dialog class="detail-dialog" aria-labelledby="${id}-detail-title"><div class="dialog-content"></div></dialog>`;
    drawResults();
  }
  function drawResults() {
    const t = currentCopy();
    const results = searchTerms(index, { query, category, lang, sort });
    $('.result-count').textContent = `${results.length} ${t.results}${category !== 'all' ? ` · ${t.category[category]}` : ''}`;
    $('.clear-search').hidden = !query;
    target.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
    $('.term-grid').innerHTML = results.length ? results.map(term => `<article class="term-card" data-term-card="${esc(term.id)}"><div class="card-top"><span class="category-label category-${term.category}"><span></span>${t.category[term.category]}</span><span class="card-language">${lang === 'tr' ? 'TR / EN' : 'EN / TR'}</span></div><h2><button type="button" data-term="${esc(term.id)}" aria-label="${esc(term[lang])} · ${t.open}">${esc(term[lang])}${ICON.arrow}</button></h2><p class="term-translation" lang="${lang === 'tr' ? 'en' : 'tr'}">${esc(term[lang === 'tr' ? 'en' : 'tr'])}</p><p class="term-definition">${esc(term.definition[lang])}</p></article>`).join('') : `<div class="empty-state">${ICON.search}<h2>${t.empty}</h2><p>${t.emptyBody}</p><button type="button" class="primary-button" data-reset>${t.reset}</button></div>`;
  }
  function showDetail(key) {
    const t = currentCopy();
    const term = byId.get(key);
    if (!term && key !== 'about') return;
    openKey = key;
    const closeButton = `<button type="button" class="icon-button dialog-close" data-close aria-label="${t.close}" autofocus>${ICON.close}</button>`;
    $('.dialog-content').innerHTML = key === 'about' ? `${closeButton}<p class="eyebrow">YOGARAMA / ASANA LAB</p><h2 id="${id}-detail-title">${t.noteTitle}</h2><p class="about-description">${t.note}</p><p class="about-description">${t.note2}</p><section class="detail-section"><h3>${t.source}</h3><ul class="sources-list">${sourcesHtml(sources.map(source => source.id))}</ul></section><a class="data-link" href="${esc(String(dataUrl))}" download="yogarama-anatomy-terms.json">${t.data} ↓</a>` : `${closeButton}<p class="category-label category-${term.category}"><span></span>${t.category[term.category]}</p><h2 id="${id}-detail-title">${esc(term[lang])}</h2><p class="detail-translation" lang="${lang === 'tr' ? 'en' : 'tr'}">${esc(term[lang === 'tr' ? 'en' : 'tr'])}</p>${term.latin ? `<p class="latin"><span>${t.latin}</span> <i lang="la">${esc(term.latin)}</i></p>` : ''}<div class="bilingual-definitions"><section lang="${lang}"><h3>${lang === 'tr' ? 'TÜRKÇE' : 'ENGLISH'}</h3><p>${esc(term.definition[lang])}</p></section><section lang="${lang === 'tr' ? 'en' : 'tr'}"><h3>${lang === 'tr' ? 'ENGLISH' : 'TÜRKÇE'}</h3><p>${esc(term.definition[lang === 'tr' ? 'en' : 'tr'])}</p></section></div>${term.aliases.length ? `<section class="detail-section"><h3>${t.aliases}</h3><div class="alias-list">${term.aliases.map(alias => `<span>${esc(alias)}</span>`).join('')}</div></section>` : ''}<section class="detail-section"><h3>${t.source}</h3><ul class="sources-list">${sourcesHtml(term.sourceIds)}</ul></section><button type="button" class="copy-button" data-copy="${esc(term.id)}">${ICON.copy}<span>${t.copy}</span></button><p class="copy-status" role="status" aria-live="polite"></p><p class="dialog-disclaimer">${t.disclaimer}</p>`;
    const dialog = $('.detail-dialog');
    if (!dialog.open) dialog.showModal();
    $('.dialog-content').scrollTop = 0;
  }
  function openDetail(key, trigger) {
    lastTrigger = trigger ?? null;
    if (syncUrl) {
      const url = new URL(location.href);
      url.hash = key === 'about' ? 'about' : `term=${key}`;
      history.pushState({ ...history.state, glossaryDialog: id }, '', url);
    }
    showDetail(key);
  }
  function closeDialog() {
    const dialog = $('.detail-dialog');
    if (!dialog?.open) return;
    dialog.close();
    openKey = null;
    if (syncUrl && history.state?.glossaryDialog === id) history.back();
    else if (syncUrl) { const url = new URL(location.href); url.hash = ''; history.replaceState(history.state, '', url); }
    if (lastTrigger?.isConnected) lastTrigger.focus();
    else $(`#${id}-search`).focus({ preventScroll: true });
  }
  function syncDialog() {
    if (!syncUrl) return;
    const hash = location.hash;
    const key = hash === '#about' ? 'about' : hash.startsWith('#term=') ? hash.slice(6) : null;
    if (key && (key === 'about' || byId.has(key))) showDetail(key);
    else { $('.detail-dialog').close(); openKey = null; }
  }
  function setLanguage(next) {
    lang = next === 'en' ? 'en' : 'tr';
    const key = openKey;
    drawShell(); writeUrl();
    if (key) showDetail(key); else $(`[data-language="${lang}"]`).focus();
  }
  readUrl(); drawShell(); syncDialog();
  target.addEventListener('click', async event => {
    const button = event.target.closest('button');
    if (!button) {
      if (event.target === $('.detail-dialog')) {
        const rect = event.target.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
      }
      return;
    }
    if (button.hasAttribute('data-language')) setLanguage(button.dataset.language);
    else if (button.hasAttribute('data-category')) { category = button.dataset.category; drawResults(); writeUrl(); }
    else if (button.hasAttribute('data-term')) openDetail(button.dataset.term, button);
    else if (button.hasAttribute('data-about')) openDetail('about', button);
    else if (button.hasAttribute('data-close')) closeDialog();
    else if (button.hasAttribute('data-clear') || button.hasAttribute('data-reset')) {
      query = ''; if (button.hasAttribute('data-reset')) category = 'all';
      $(`#${id}-search`).value = ''; drawResults(); writeUrl(); $(`#${id}-search`).focus();
    } else if (button.hasAttribute('data-copy')) {
      const term = byId.get(button.dataset.copy);
      const status = $('.copy-status');
      try { await navigator.clipboard.writeText(`${term.tr} — ${term.en}`); status.textContent = currentCopy().copied; }
      catch { if (status?.isConnected) status.textContent = currentCopy().copyFailed; }
      clearTimeout(copyTimer); copyTimer = setTimeout(() => { if (status.isConnected) status.textContent = ''; }, 5000);
    }
  }, { signal });
  target.addEventListener('input', event => {
    if (event.target.id !== `${id}-search`) return;
    query = event.target.value; drawResults(); writeUrl();
  }, { signal });
  target.addEventListener('change', event => {
    if (!event.target.hasAttribute('data-sort')) return;
    sort = event.target.value; drawResults(); writeUrl();
  }, { signal });
  target.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); }, { signal, capture: true });
  document.addEventListener('keydown', event => {
    const active = document.activeElement;
    if (active?.matches('input, textarea, select, [contenteditable="true"]') || $('.detail-dialog').open) return;
    if ((event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) || (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey))) {
      event.preventDefault(); $(`#${id}-search`).focus();
    }
  }, { signal });
  if (syncUrl) {
    window.addEventListener('popstate', () => {
      const previousKey = openKey;
      readUrl(); drawShell(); syncDialog();
      if (!openKey && previousKey) {
        const restoredTrigger = previousKey === 'about' ? $('[data-about]') : target.querySelector(`[data-term="${previousKey}"]`);
        (restoredTrigger ?? $(`#${id}-search`)).focus({ preventScroll: true });
      }
    }, { signal });
    window.addEventListener('hashchange', syncDialog, { signal });
  }
  return { destroy() { controller.abort(); clearTimeout(copyTimer); $('.detail-dialog')?.close(); target.replaceChildren(); target.classList.remove('anatomy-glossary'); }, setLanguage };
}
