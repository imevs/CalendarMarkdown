# Calendar Markdown Generator

A zero-dependency vanilla TypeScript web app that generates calendars in Markdown, plain text, and rendered HTML formats.

## Features

- **Multiple views** — Month or full Year calendar
- **Year layouts** — 1, 2, or 3 column grid, plus a Continuous (single-table) layout
- **Output formats**:
  - **Raw Markdown** — copy-pasteable Markdown tables
  - **Rendered HTML** — built-in lightweight renderer (zero dependencies)
  - **Rendered (marked.js)** — lazy-loaded from CDN on demand
  - **Plain Text** — monospaced text grid
- **Configurable start day** — Monday or Sunday
- **Light / Dark theme** — auto-detects system preference, manual toggle saved to `localStorage`
- **Shareable links** — copy a URL that opens the calendar in raw mode
- **Responsive** — scales down cleanly on small screens
- **Tiny bundle** — ~11 KB minified, no runtime dependencies

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 8080 |
| `npm test` | Run unit tests (Jest) |
| `npm run build` | Production build to `$APP_FOLDER_NAME` |
| `npm run watch` | Rebuild on file changes |

## Examples

### Month View

| Mon | Tue | Wed | Thu | Fri | Sat | Sun |
| --- | --- | --- | --- | --- | --- | --- |
|     |   1 |   2 |   3 |   4 |   5 |   6 |
|   7 |   8 |   9 |  10 |  11 |  12 |  13 |
|  14 |  15 |  16 |  17 |  18 |  19 |  20 |
|  21 |  22 |  23 |  24 |  25 |  26 |  27 |
|  28 |  29 |  30 |  31 |     |     |     |

Raw Markdown:

```
### October 2024

| Mon | Tue | Wed | Thu | Fri | Sat | Sun |
| --- | --- | --- | --- | --- | --- | --- |
|     |   1 |   2 |   3 |   4 |   5 |   6 |
|   7 |   8 |   9 |  10 |  11 |  12 |  13 |
|  14 |  15 |  16 |  17 |  18 |  19 |  20 |
|  21 |  22 |  23 |  24 |  25 |  26 |  27 |
|  28 |  29 |  30 |  31 |     |     |     |
```

## URL Parameters (Raw Mode)

When `year` is provided in the URL, the app renders in **raw mode** — just the calendar output, no UI chrome. Useful for embedding or bookmarking.

| Param | Values | Default |
|-------|--------|---------|
| `year` | `2024`, `2025`, ... | current year |
| `month` | `1`–`12` | current month |
| `view` | `Month`, `Year` | `Year` |
| `columns` | `1`, `2`, `3`, `continuous` | `1` |
| `startDay` | `Monday`, `Sunday` | `Monday` |
| `renderAs` | `markdown`, `html`, `marked`, `text` | `markdown` |

**Example:** `?year=2026&view=Year&columns=3&renderAs=html`

## Tech Stack

- **TypeScript** (ES2016 target)
- **esbuild** for bundling & dev server
- **Jest + ts-jest** for testing
- **Vanilla CSS** with CSS custom properties for theming
- **marked.js** (optional, lazy-loaded from CDN)

## License

ISC
