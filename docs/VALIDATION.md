# Validation report

Date: 2026-10-13. Status: **MIT release preparation; repository publication not yet verified**.

The syntax checks, nine tests, static build, and offline generation below were rerun on the release files with Node.js v24.14.1.

## Passed

- Node.js syntax validation for `src/search.js`, `src/glossary.js`, and `src/main.js`
- Nine automated tests using the Node.js built-in test runner:
  1. At least 100 unique, bilingual, source-referenced entries and all six categories
  2. Turkish diacritics and dotted/dotless i normalization
  3. English and accentless Turkish lookup of the same scapula entry
  4. Category filtering
  5. Empty query handling without source mutation
  6. No-result and incompatible-filter behavior
  7. Exact-name ranking and all-token matching
  8. Turkish/English alphabetic sorting
  9. Rejection of duplicate IDs, missing definitions, invalid categories and unresolved sources
- Static build and offline single-file generation
- All original data definitions include a source ID resolving to an HTTPS public reference

## Implementation checks

The UI includes native modal dialogs, labeled controls, a live result count, visible keyboard focus, a skip link, `Esc` dismissal, search shortcuts, reduced-motion support, and responsive CSS. Data is escaped before HTML insertion and source links are restricted to HTTPS. These are implementation checks, not a claim of formal WCAG conformance.

## Not completed in this environment

- Visual/browser interaction QA, desktop/mobile screenshots, and automated accessibility audit
- Cross-browser testing, screen-reader testing, and verified clipboard interaction
- Deployed subpath/deep-link testing
- Independent anatomy educator/clinician and fluent Turkish editorial review

### Browser QA limit

Rendered desktop/mobile views and UI interactions have not been verified. The available browser interface rejected local-file navigation under its security policy. That restriction was not bypassed. No rendered screenshot or completed visual QA is claimed.

## Suggested next review

On an authorized computer, run `npm run dev`, then check:

- At 1440 px, 768 px, and 390 px: no horizontal overflow; readable cards and dialogs
- Search `kurek kemigi`, `scapula`, `İÇ ROTASYON`, and an unknown word
- Switch languages with a query/filter active; filter and reset; sort A–Z
- Open a term with Enter, close with Escape, reopen repeatedly, click the backdrop
- Verify keyboard focus returns after dismissal; Tab stays inside an open dialog
- Open a deep link; test Back/Forward and reload
- Download data and test copy on HTTPS or localhost
- Confirm all source links still resolve and manually review their term coverage

## Publication

The project includes an MIT LICENSE and matching package metadata. Remote repository publication and CI have not been verified. No website deployment is asserted.
