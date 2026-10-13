import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeText, createSearchIndex, searchTerms, validateTerms, CATEGORIES } from '../src/search.js';
import { readFile } from 'node:fs/promises';
const terms = JSON.parse(await readFile(new URL('../data/terms.json', import.meta.url), 'utf8'));
const sources = JSON.parse(await readFile(new URL('../data/sources.json', import.meta.url), 'utf8'));
const index = createSearchIndex(terms);

test('dataset has at least 100 unique and fully bilingual referenced entries', () => {
  assert.ok(terms.length >= 100);
  assert.deepEqual(validateTerms(terms, sources), []);
  for (const category of CATEGORIES) assert.ok(terms.some(term => term.category === category));
  assert.equal(new Set(sources.map(source => source.id)).size, sources.length);
  for (const source of sources) {
    assert.equal(new URL(source.url).protocol, 'https:');
    assert.ok(source.title && source.organization && source.accessed);
  }
});
test('Turkish accented/dotted and dotless characters normalize consistently', () => {
  assert.equal(normalizeText('ÇĞİIıÖŞÜ'), 'cgiiiosu');
  assert.equal(normalizeText('  Kürek—KEMİĞİ  '), 'kurek kemigi');
  assert.equal(normalizeText('İç rotasyon'), normalizeText('ic rotasyon'));
  assert.equal(normalizeText(null), '');
});
test('English and accentless Turkish find the same scapula entry', () => {
  const en = searchTerms(index, { query: 'scapula' });
  const tr = searchTerms(index, { query: 'kurek kemigi' });
  assert.ok(en.length && tr.length);
  assert.equal(en[0].id, tr[0].id);
});
test('category filters only include their category', () => {
  for (const category of CATEGORIES) {
    const results = searchTerms(index, { category });
    assert.ok(results.length);
    assert.ok(results.every(term => term.category === category));
  }
});
test('empty query returns all entries without mutating source data', () => {
  const original = JSON.stringify(terms);
  assert.equal(searchTerms(index).length, terms.length);
  assert.equal(searchTerms(index, { query: ' \t ' }).length, terms.length);
  assert.equal(JSON.stringify(terms), original);
});
test('unmatched query and unrelated filter produce no results', () => {
  assert.deepEqual(searchTerms(index, { query: 'zzzznonexistentword' }), []);
  assert.deepEqual(searchTerms(index, { query: 'scapula', category: 'directions' }), []);
});
test('exact names rank before definitions and multiword search uses all tokens', () => {
  const fixture = createSearchIndex([
    {id:'related',en:'Another term',tr:'Başka',aliases:[],definition:{en:'Related to the scapula.',tr:'Açıklama'}},
    {id:'exact',en:'Scapula',tr:'Kürek kemiği',aliases:['shoulder blade'],definition:{en:'Flat shoulder bone.',tr:'Yassı kemik'}}
  ]);
  assert.equal(searchTerms(fixture, { query: 'scapula' })[0].id, 'exact');
  assert.deepEqual(searchTerms(fixture, { query: 'shoulder blade' }).map(term => term.id), ['exact']);
  assert.deepEqual(searchTerms(fixture, { query: 'scapula zzz' }), []);
});
test('alphabetical sorting follows the displayed language', () => {
  for (const lang of ['tr','en']) {
    const results = searchTerms(index, { lang, sort: 'alpha' });
    const sorted = [...results].sort((a,b) => new Intl.Collator(lang,{sensitivity:'base'}).compare(a[lang],b[lang]));
    assert.deepEqual(results, sorted);
  }
});
test('validation detects duplicate ids, invalid categories and missing references', () => {
  const broken = JSON.parse(JSON.stringify(terms.slice(0,2)));
  broken[1].id = broken[0].id;
  broken[0].category = 'unknown'; broken[0].sourceIds = ['missing']; broken[0].definition.tr = '';
  const errors = validateTerms(broken, sources).join('\n');
  assert.match(errors, /Duplicate/); assert.match(errors, /category/); assert.match(errors, /Unknown source/); assert.match(errors, /definition/);
});
