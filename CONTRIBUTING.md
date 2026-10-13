# Contributing / Katkıda bulunma

This project is licensed under the MIT License; see [LICENSE](LICENSE). Contributions should preserve its bilingual educational scope and per-term references.

## Content changes

1. Keep existing term IDs stable.
2. Include accurate English and Turkish names and original concise definitions.
3. Add useful conventional aliases, not keyword stuffing.
4. Cite a specific public primary educational source in `data/sources.json` and its ID on the term.
5. Do not copy proprietary descriptions, illustrations, or textbook passages.
6. Avoid diagnostic, treatment, pain-management, or one-size-fits-all yoga alignment advice.
7. Flag context-dependent translations. For substantive anatomy changes, seek review by a qualified anatomy educator or health professional and a fluent Turkish reviewer.
8. Run `npm run check`, review both interface languages, and check keyboard and mobile flows.

## Development

The app deliberately has no runtime dependencies or telemetry. Keep data/search separate from the UI. Escape all displayed content and only allow HTTPS references. Preserve per-term citations, visible focus, adequate color contrast, native dialog semantics, and reduced-motion support.

## Privacy

Do not include patient information, personal health records, credentials, tracking code, or private source files in issues, commits, or the data set.
