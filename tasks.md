# Task Checklist: Calendar Markdown Generator

- [x] **Phase 1: Project Setup**
  - [x] Initialize `package.json` and install `typescript`, `esbuild`, `jest`, `@types/jest`, `ts-jest` as DEV dependencies.
  - [x] Configure `jest.config.js` for TypeScript.
  - [x] Create `tsconfig.json` with `ES2016` target.
  - [x] Add build scripts to `package.json`.

- [x] **Phase 2: Core Logic (`src/calendarGenerator.ts`)**
  - [x] Implement calendar mathematical logic (days in month, offsets).
  - [x] Implement markdown generation "With Borders" (Markdown table).
  - [x] Implement markdown generation "Without Borders" (Preformatted spacing).
  - [x] Support configurable start day (Monday or Sunday).

- [x] **Phase 3: Custom Markdown Renderer (`src/markdownRenderer.ts`)**
  - [x] Implement a zero-dependency markdown parser to convert the generated text to HTML (table and pre tags).

- [x] **Phase 4: UI & State Management (`src/index.ts` & `index.html`)**
  - [x] Scaffold `index.html` with generator controls.
  - [x] Implement detection logic for **Raw Mode** (param presence).
  - [x] Implement **Raw Mode** rendering (clears page, shows text).
  - [x] Implement **UI Mode** with rich CSS (animations, light/dark mode).
  - [x] Add **Theme Switcher** component and `localStorage` logic.
  - [x] Add "Copy Shareable Link" button and logic.
  - [x] Implement "Copy as Markdown" functionality.
  - [x] Handle validation and error display for both modes.

- [x] **Phase 5: Unit Tests**
  - [x] Write unit tests for `calendarGenerator.test.ts`.
  - [x] Write unit tests for `markdownRenderer.test.ts`.
  - [x] Run test suite and ensure all assertions pass.

- [x] **Phase 7: Year View & Reactive UI**
  - [x] Update `calendarGenerator.ts` with `View` mode and Year logic.
  - [x] Update `markdownRenderer.ts` to support grid layouts.
  - [x] Update `index.html` with View/Columns selectors and remove Generate button.
  - [x] Implement reactive event listeners in `index.ts`.
  - [x] Update URL/State handling in `index.ts`.
  - [x] Verify everything in the browser.

- [x] **Phase 8: Preview Selection & Grid Layout Fixes**
  - [x] Add "Show as" (HTML/Markdown) selector to `index.html`.
  - [x] Optimize Year View 3-column CSS for container fit.
  - [x] Update `index.ts` to handle `renderAs` state and logic.
  - [x] Verify in the browser.

- [x] **Phase 9: Rendering & Layout Fixes**
  - [x] Fix `renderMonth` table parsing in `markdownRenderer.ts`.
  - [x] Implement "Zipping" algorithm for Markdown Columns in `calendarGenerator.ts`.
  - [x] Handle multiple months in `calendarGenerator.ts` for Year view markdown.
  - [x] Verify in the browser.

- [x] **Phase 10: Canonical/Zipped Separation & Layout Fixes**
  - [x] Revert `generateCalendarMarkdown` to canonical (vertical) format.
  - [x] Add `zipMarkdownRows` helper for zipped markdown output.
  - [x] Fix table detection in `markdownRenderer.ts`.
  - [x] Update `index.ts` to use canonical for HTML and zipped for Raw/Copy.
  - [x] Verify in browser.

- [x] **Phase 11: Zipped Monospaced Multi-Column Output**
  - [x] Refactor `zipMarkdownRows` to use monospaced blocks for all multi-column states.
  - [x] Simplify zipping logic and increase horizontal spacing (e.g. 8 spaces).
  - [x] Update unit tests for the new spacing.
  - [x] Verify in browser.

- [x] **Phase 12: Splitter & Header Consolidation**
  - [x] Modify `zipMarkdownRows` to consolidated `###` headers in rows.
  - [x] Add `---` thematic break between row chunks in Markdown output.
  - [x] Add `---` delimiter between columns in the Markdown table separator.
  - [x] Update unit tests to verify the new header and splitter style.
  - [x] Verify in browser (Raw Markdown View).

- [x] **Phase 13: 8-Column Native Markdown Table Layout**
  - [x] Refactor `zipMarkdownRows` to parse canonical tables into 2D grids.
  - [x] Implement 8-column transformation (Month Name in first col).
  - [x] Pad all columns of the month blocks to 10 symbols.
  - [x] Support zipping multiple 8-column grids into a single native table.
  - [x] Update unit tests for the new structure.
  - [x] Verify in browser.

- [x] **Phase 14: UI / UX Polish**
  - [x] Make Markdown preview scrollable (disable wrapping).
  - [x] Ensure monospaced alignment is preserved on overflow.

- [/] **Phase 15: Layout Cleanup**
  - [ ] Remove `Layout` configuration from `CalendarOptions`.
  - [ ] Remove the `Layout` select from the UI (`index.html`).
  - [ ] Update `generateMonthGrid` to focus on bordered markdown.

- [x] **Phase 16: Text Mode Support**
  - [x] Implement `generateCalendarText` and `zipRows` for plain text calendars.
  - [x] Add "Plain Text" option to the "Show as" select.
  - [x] Verify alignment and columns in Text mode.

- [x] **Phase 17: Simplified Text View**
  - [x] Refactor `zipRows` for text mode to use 7-column grid (3-char padding).
  - [x] Implement Month Name as a top-level header for each month block.
  - [x] Compact the gaps between columns and months.
  - [x] Update unit tests.

- [x] **Phase 18: Continuous Layout**
  - [x] Update `CalendarOptions` to support `'continuous'` columns value.
  - [x] Implement `generateContinuousCalendar` for Markdown and Text modes.
  - [x] Route the generator functions to produce the continuous single table when selected.
  - [x] Add option to `index.html` and parse it in `index.ts`.
