import { readFile, writeFile } from 'node:fs/promises';
const read = path => readFile(path, 'utf8');
const [html, css, search, glossary, terms, sources] = await Promise.all(['index.html','src/styles.css','src/search.js','src/glossary.js','data/terms.json','data/sources.json'].map(read));
const inlineData = value => JSON.stringify(JSON.parse(value)).replace(/</g, '\\u003c');
const js = search.replaceAll('export ', '') + '\n' + glossary.replace(/^import .*?;\n/, '').replaceAll('export ', '') + `\nmountGlossary(document.querySelector('#app'), { terms: ${inlineData(terms)}, sources: ${inlineData(sources)}, dataUrl: 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(${inlineData(terms)})), sourcesUrl: 'data:application/json,[]', syncUrl: false, documentLanguage: true });`;
const output = html.replace(/<link rel="icon"[^>]+>/, '').replace('<link rel="stylesheet" href="./src/styles.css">', `<style>${css}</style>`).replace('<script type="module" src="./src/main.js"></script>', `<script type="module">${js.replaceAll('</script', '<\\/script')}</script>`);
await writeFile('yogarama-glossary-standalone.html', output);
console.log('Created a self-contained offline HTML edition (URL synchronization disabled).');
