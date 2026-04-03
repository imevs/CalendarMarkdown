# Final Calendar Markdown Generator Implementation Plan

This plan describes the implementation of a Vanilla TypeScript (no frameworks, zero runtime dependencies) web application that generates a calendar in Markdown format, handles URL parameters, and renders the result natively to HTML.

## Chosen Architecture & Stack
- **Core language**: TypeScript (vanilla).
- **Build tool**: `esbuild` for dev and bundling the script into one single file, targeting `ES2016`.
- **Markdown Render**: **Zero dependencies.** We will implement a custom, lightweight Markdown-to-HTML parser specific to our use cases (tables with and without borders) ensuring no `marked` dependency is needed.
- **Styling**: Vanilla CSS designed with rich aesthetics (animations, light/dark mode with manual switcher, clean structural UI).
- **Theme Support**: Defaults to system preference with a manual override saved in `localStorage`.

## Functionality Details

- **URL Handling**: 
  - **UI Mode**: If no URL parameters are provided, the app displays the full generator UI (defaulting to the current date).
  - **Raw Mode**: If `year` or `month` parameters are provided, the app renders **only** the plain markdown content (no header, no buttons, no styling other than the text itself).
  - Invalid parameters (e.g., `?month=13`) trigger a minimal raw error message if in Raw Mode, or a UI error banner in UI Mode.
- **Configurability**: 
  - **Starting Day**: Selectable between **Monday** (default) or **Sunday**.
  - **Layout**: "With Borders" (Markdown table) or "Without Borders" (monospaced grid).
  - **Theme**: Light or Dark mode.
- **Shareable Link**: A button on the main UI allows users to copy a URL containing the current generator settings, which will open in 'Raw Mode' for others.

## Proposed Changes

### Configuration
#### `package.json`
Development dependencies: `typescript`, `esbuild` (for ES2016 bundling), and testing libraries (`jest`, `@types/jest`, `ts-jest`).
#### `tsconfig.json`
Configures compiler target to `ES2016`.

---

### Application Logic

#### `index.html`
- Inputs: `Year`, `Month`, `Start Day`, `Layout`, `Generate` button.
- **Theme Switcher**: Toggle button to switch between Light and Dark mode.
- Clean container to display validation errors.
- Visual block for the natively rendered HTML calendar.
- Final output points to `<script src="dist/bundle.js"></script>`.

#### `src/index.ts`
- **Controller**:
  - Detects if URL parameters are present.
  - **Raw Mode Logic**: If parameters exist, clears the DOM and renders only the generated Markdown as plain text.
  - **UI Mode Logic**: Otherwise, initializes the full interactive generator interface.
  - **Share Link**: Implements a function to generate and copy the parameterized URL to the clipboard.
- **Error Display**: Handles validation errors for both modes.

#### `src/calendarGenerator.ts`
- Exposes `generateCalendar(year, month, startDay, layout)` returning the exact Markdown String.
- "With Borders": Outputs a standard Markdown table using `|` syntax.
- "Without Borders": Outputs a grid block structured with whitespace that looks correct in an HTML `<pre>` tag.

#### `src/markdownRenderer.ts`
- Exposes `renderToHtml(markdownString, layout)`
- Parses the generated Markdown. If layout is 'With Borders', it constructs an HTML `<table>`. If 'Without Borders', it renders plain text inside a `<pre>` monospace block.

## Verification Plan
1. **Unit Tests**:
   - Unit tests for `calendarGenerator.ts` to verify calendar leap years, boundary months, and accurate text formatting for both layout options.
   - Unit tests for `markdownRenderer.ts` to ensure proper DOM element mapping.
   - Automated run via `npm test`.
2. **Automated Run**: `npx tsc --noEmit` and run esbuild for a clean single-script bundle.
3. **Behavioral Validations**:
   - Accessing `?year=xyz` shows the error banner exclusively.
   - Accessing missing params falls back to current date smoothly.
   - Changing "Start Day" from Monday to Sunday accurately rebuilds the grid.
   - Output copies completely to the clipboard in correct raw Markdown representation.
