"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/calendarGenerator.ts
  function generateCalendarMarkdown(options) {
    const { year, month, view } = options;
    if (options.columns === "continuous" && view === "Year") {
      return generateContinuousCalendar(options, "markdown");
    }
    if (view === "Year") {
      let result = `# Calendar ${year}

`;
      for (let m = 1; m <= 12; m++) {
        result += `### ${MONTH_NAMES[m - 1]} ${year}

`;
        result += renderMarkdownTable(generateMonthGrid(options, m));
        result += "\n\n";
      }
      return result.trim();
    } else {
      const m = month || (/* @__PURE__ */ new Date()).getMonth() + 1;
      const header = `### ${MONTH_NAMES[m - 1]} ${year}

`;
      return header + renderMarkdownTable(generateMonthGrid(options, m));
    }
  }
  function generateCalendarText(options) {
    const { year, month, view } = options;
    if (options.columns === "continuous" && view === "Year") {
      return generateContinuousCalendar(options, "text");
    }
    if (view === "Year") {
      let result = `${year} Calendar

`;
      for (let m = 1; m <= 12; m++) {
        result += `${MONTH_NAMES[m - 1]} ${year}

`;
        result += renderTextTable(generateMonthGrid(options, m));
        result += "\n\n";
      }
      return result.trim();
    } else {
      const m = month || (/* @__PURE__ */ new Date()).getMonth() + 1;
      const header = `${MONTH_NAMES[m - 1]} ${year}

`;
      return header + renderTextTable(generateMonthGrid(options, m));
    }
  }
  function renderMarkdownTable(grid) {
    const pad = (s) => s.padStart(3, " ");
    const header = grid[0] || [];
    let md = "| " + header.map(pad).join(" | ") + " |\n";
    md += "| " + header.map(() => "---").join(" | ") + " |\n";
    for (let i = 1; i < grid.length; i++) {
      const row = grid[i] || [];
      md += "| " + row.map(pad).join(" | ") + " |\n";
    }
    return md.trim();
  }
  function renderTextTable(grid) {
    const pad = (s) => s.padStart(3, " ");
    const header = grid[0] || [];
    let txt = header.map(pad).join(" ") + "\n";
    txt += header.map(() => "---").join(" ") + "\n";
    for (let i = 1; i < grid.length; i++) {
      const row = grid[i] || [];
      txt += row.map(pad).join(" ") + "\n";
    }
    return txt.trim();
  }
  function zipRows(canonical, options, format) {
    const { columns, view } = options;
    if (columns === "continuous" || columns <= 1 || view === "Month") return canonical;
    const separator = format === "markdown" ? /(?=### )/ : new RegExp(`(?=(?:${MONTH_NAMES.join("|")}) \\d{4})`);
    const monthSections = canonical.split(separator).map((s) => s.trim()).filter((s) => s.length > 0);
    const firstSection = monthSections[0] || "";
    const isYearHeader = firstSection.includes("Calendar");
    let yearHeader = "";
    if (isYearHeader) {
      yearHeader = monthSections.shift() || "";
    }
    let result = yearHeader ? `${yearHeader.trim()}

` : "";
    for (let i = 0; i < monthSections.length; i += columns) {
      const monthsInRow = [];
      for (let j = 0; j < columns && i + j < monthSections.length; j++) {
        const section = monthSections[i + j] || "";
        let monthName = "";
        if (format === "markdown") {
          const match = section.match(/### (.*) \d{4}/);
          monthName = match && match[1] ? match[1] : "";
        } else {
          const match = section.match(/^([A-Za-z]+) \d{4}/);
          monthName = match && match[1] ? match[1] : "";
        }
        let gridLines = [];
        if (format === "markdown") {
          gridLines = section.split("\n").filter((l) => l.includes("|"));
        } else {
          const allLines = section.split("\n").filter((l) => l.trim().length > 0);
          gridLines = allLines.slice(1);
        }
        const grid = gridLines.map((line) => {
          if (format === "markdown") {
            return line.split("|").map((c) => c.trim()).slice(1, -1);
          } else {
            const cells = [];
            for (let k = 0; k < 7; k++) {
              cells.push(line.slice(k * 4, k * 4 + 3).trim());
            }
            return cells;
          }
        });
        monthsInRow.push({ name: monthName, grid });
      }
      if (monthsInRow.length === 0) continue;
      if (format === "markdown") {
        const transformedGrids = monthsInRow.map((m) => {
          const newGrid = [];
          const pad10 = (s) => s.padEnd(10, " ");
          newGrid.push([m.name, ...Array(7).fill("")].map(pad10));
          newGrid.push(Array(8).fill("---").map(pad10));
          m.grid.forEach((row, idx) => {
            const isSeparator = idx === 1 && row.every((c) => c === "---" || c === "");
            if (isSeparator) return;
            newGrid.push(["", ...row].map(pad10));
          });
          return newGrid;
        });
        const maxHeight = Math.max(...transformedGrids.map((g) => g.length));
        transformedGrids.forEach((g) => {
          const pad10 = (s) => s.padEnd(10, " ");
          while (g.length < maxHeight) g.push(Array(8).fill("").map(pad10));
        });
        for (let h = 0; h < maxHeight; h++) {
          const rowCells = [];
          transformedGrids.forEach((grid, gIdx) => {
            const row = grid[h] || Array(8).fill("".padEnd(10, " "));
            rowCells.push(...row);
            if (gIdx < transformedGrids.length - 1) {
              rowCells.push(h === 1 ? "---" : "   ");
            }
          });
          result += "| " + rowCells.join(" | ") + " |\n";
        }
      } else {
        const transformedGrids = monthsInRow.map((m) => {
          const newGrid = [];
          const pad3 = (s) => s.padStart(3, " ");
          const headerText = m.name;
          const leftPad = Math.floor((27 - headerText.length) / 2);
          const centeredHeader = [" ".repeat(leftPad) + headerText + " ".repeat(27 - leftPad - headerText.length)];
          newGrid.push(centeredHeader);
          newGrid.push([" ".repeat(27)]);
          m.grid.forEach((row, idx) => {
            const isSeparator = idx === 1 && row.every((c) => c === "---" || c === "");
            if (isSeparator) return;
            newGrid.push([row.map(pad3).join(" ")]);
          });
          return newGrid;
        });
        const maxHeight = Math.max(...transformedGrids.map((g) => g.length));
        transformedGrids.forEach((g) => {
          while (g.length < maxHeight) g.push([" ".repeat(27)]);
        });
        for (let h = 0; h < maxHeight; h++) {
          let rowStr = "  ";
          transformedGrids.forEach((grid, gIdx) => {
            const row = grid[h] || [" ".repeat(27)];
            rowStr += row[0];
            if (gIdx < transformedGrids.length - 1) {
              rowStr += "    ";
            }
          });
          result += rowStr.trimEnd() + "\n";
        }
      }
      result += "\n";
    }
    return result.trim();
  }
  function generateMonthGrid(options, m) {
    const { year, startDay } = options;
    const daysInMonth = new Date(year, m, 0).getDate();
    const firstDayOfMonth = new Date(year, m - 1, 1).getDay();
    let offset = firstDayOfMonth;
    if (startDay === "Monday") {
      offset = (firstDayOfMonth + 6) % 7;
    }
    const dayNames = startDay === "Monday" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const grid = [dayNames];
    let currentDay = 1;
    let row = Array(7).fill("");
    for (let i = offset; i < 7; i++) {
      row[i] = currentDay.toString();
      currentDay++;
    }
    grid.push(row);
    while (currentDay <= daysInMonth) {
      row = Array(7).fill("");
      for (let i = 0; i < 7 && currentDay <= daysInMonth; i++) {
        row[i] = currentDay.toString();
        currentDay++;
      }
      grid.push(row);
    }
    return grid;
  }
  function generateContinuousCalendar(options, format) {
    const { year, startDay } = options;
    const isMondayStart = startDay === "Monday";
    const dayHeaders = isMondayStart ? ["  M", "  T", "  W", "  T", "  F", "  S", "  S"] : ["  S", "  M", "  T", "  W", "  T", "  F", "  S"];
    let md = "";
    if (format === "markdown") {
      md += `# Calendar ${year}

`;
      md += `|  W |   Month | ${dayHeaders.join(" | ")} |
`;
      md += `| --:| -------:| -----:| -----:| -----:| -----:| -----:| -----:| -----:|
`;
    } else {
      md += `${year} Calendar

`;
      md += `  W    Month   ${dayHeaders.join("   ")}
`;
      md += ` --  -------   ---   ---   ---   ---   ---   ---   ---
`;
    }
    let currentDate = new Date(year, 0, 1);
    const jsDay = currentDate.getDay();
    let diff = jsDay;
    if (isMondayStart) {
      diff = jsDay === 0 ? 6 : jsDay - 1;
    }
    let currentWeekStart = new Date(year, 0, 1 - diff);
    let weekNum = 1;
    const lastDayOfYear = new Date(year, 11, 31);
    let lastPrintedMonth = -1;
    while (currentWeekStart <= lastDayOfYear) {
      const rowDays = [];
      let weekContainsCurrentYear = false;
      let rowMonth = -1;
      for (let i = 0; i < 7; i++) {
        const d = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + i);
        if (d.getFullYear() === year) {
          weekContainsCurrentYear = true;
          rowDays.push(d.getDate().toString().padStart(2, " "));
          if (rowMonth === -1 || d.getDate() === 1) {
            rowMonth = d.getMonth();
          }
        } else {
          rowDays.push("  ");
        }
      }
      if (weekContainsCurrentYear) {
        let monthLabel = "     ";
        if (rowMonth !== -1 && rowMonth !== lastPrintedMonth) {
          lastPrintedMonth = rowMonth;
          const monthShort = (MONTH_NAMES[rowMonth] || "").substring(0, 3).toUpperCase();
          monthLabel = format === "markdown" ? `**${monthShort}**` : monthShort.padEnd(5, " ");
          if (format === "markdown") {
            monthLabel = monthLabel.padStart(7, " ");
          }
        } else {
          monthLabel = format === "markdown" ? "       " : "     ";
        }
        const wStr = weekNum.toString().padStart(2, "0");
        if (format === "markdown") {
          const dayStrs = rowDays.map((d) => d.padStart(5, " "));
          md += `| ${wStr} | ${monthLabel} | ${dayStrs.join(" | ")} |
`;
        } else {
          const dayStrs = rowDays.map((d) => d.padStart(3, " "));
          const mLabel = monthLabel.padStart(7, " ");
          md += ` ${wStr}    ${mLabel}   ${dayStrs.join("   ")}
`;
        }
        weekNum++;
      }
      currentWeekStart = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + 7);
    }
    return md.trim();
  }
  var MONTH_NAMES;
  var init_calendarGenerator = __esm({
    "src/calendarGenerator.ts"() {
      "use strict";
      MONTH_NAMES = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
    }
  });

  // src/markdownRenderer.ts
  function renderMarkdownToHtml(markdown, view, columns) {
    if (view === "Month") {
      const lines = markdown.trim().split("\n");
      const firstLine = lines[0] || "";
      const header = firstLine.startsWith("### ") ? lines.shift() || "" : "";
      const content = lines.join("\n");
      return `
      <div class="month-card">
        ${header ? `<h3 style="margin-top: 0;">${header.replace("### ", "")}</h3>` : ""}
        ${renderMonth(content)}
      </div>
    `;
    }
    if (columns === "continuous") {
      const lines = markdown.trim().split("\n");
      const firstLine = lines[0] || "";
      const yearHeader2 = firstLine.startsWith("# ") ? lines.shift() || "" : "";
      const content = lines.join("\n");
      return `
      <div class="year-view">
        ${yearHeader2 ? `<h1>${yearHeader2.replace("# ", "")}</h1>` : ""}
        ${renderMonth(content)}
      </div>
    `;
    }
    const monthSections = markdown.split(/(?=### )/);
    const firstSection = monthSections[0] || "";
    const yearHeader = firstSection.startsWith("# ") ? monthSections.shift() : "";
    const gridStyle = `display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 2rem;`;
    const renderedMonths = monthSections.map((section) => {
      const lines = section.split("\n");
      const header = lines.shift() || "";
      const content = lines.join("\n");
      return `
      <div class="month-card">
        <h3 style="margin-top: 0;">${header.replace("### ", "")}</h3>
        ${renderMonth(content)}
      </div>
    `;
    }).join("");
    return `
    <div class="year-view">
      ${yearHeader ? `<h1>${yearHeader.replace("# ", "")}</h1>` : ""}
      <div style="${gridStyle}">
        ${renderedMonths}
      </div>
    </div>
  `;
  }
  function renderMonth(markdown) {
    const allLines = markdown.trim().split("\n");
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const altDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const startIdx = allLines.findIndex((line) => {
      const t = line.trim();
      if (t.startsWith("|")) return true;
      return t.includes("|") && (dayNames.some((d) => t.includes(d)) || altDayNames.some((d) => t.includes(d)));
    });
    if (startIdx === -1) {
      return `<pre style="font-family: 'JetBrains Mono', monospace; padding: 1rem; background: rgba(0,0,0,0.1); border-radius: 8px; overflow-x: auto; margin: 0;">${markdown.trim()}</pre>`;
    }
    const tableLines = allLines.slice(startIdx);
    if (tableLines.length < 2) return `<pre>${tableLines.join("\n")}</pre>`;
    const getCells = (line) => {
      let cells = line.split("|");
      if (line.startsWith("|")) cells.shift();
      if (line.endsWith("|")) cells.pop();
      return cells.map((c) => c.trim());
    };
    const headerCells = getCells(tableLines[0] || "");
    const header = headerCells.map((s) => `<th>${s}</th>`).join("");
    const rows = tableLines.slice(2).map((line) => {
      const rowCells = getCells(line);
      if (rowCells.length === 0) return "";
      const cells = rowCells.map((s) => {
        const formatted = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return `<td>${formatted}</td>`;
      }).join("");
      return `<tr>${cells}</tr>`;
    }).filter((row) => row !== "").join("");
    return `
    <table class="calendar-table">
      <thead>
        <tr>${header}</tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
  }
  var init_markdownRenderer = __esm({
    "src/markdownRenderer.ts"() {
      "use strict";
    }
  });

  // src/index.ts
  var require_index = __commonJS({
    "src/index.ts"() {
      init_calendarGenerator();
      init_markdownRenderer();
      function getParams() {
        const params = new URLSearchParams(window.location.search);
        const pYear = params.get("year");
        const pMonth = params.get("month");
        const pColumns = params.get("columns");
        const pRenderAs = params.get("renderAs");
        let columnsVal = void 0;
        if (pColumns === "continuous") {
          columnsVal = "continuous";
        } else if (pColumns) {
          columnsVal = parseInt(pColumns);
        }
        return {
          year: pYear ? parseInt(pYear) : void 0,
          month: pMonth ? parseInt(pMonth) : void 0,
          startDay: params.get("startDay") || void 0,
          view: params.get("view") || void 0,
          columns: columnsVal,
          renderAs: pRenderAs || void 0
        };
      }
      function initTheme() {
        const savedTheme = localStorage.getItem("theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const theme = savedTheme || systemTheme;
        document.documentElement.setAttribute("data-theme", theme);
      }
      function toggleTheme() {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
      }
      function updateUI(state) {
        const el = (id) => document.getElementById(id);
        if (el("year")) el("year").value = state.year.toString();
        if (el("month")) el("month").value = (state.month || 1).toString();
        if (el("startDay")) el("startDay").value = state.startDay;
        if (el("view")) el("view").value = state.view;
        if (el("columns")) el("columns").value = state.columns.toString();
        if (el("renderAs")) el("renderAs").value = state.renderAs;
        const monthGroup = document.getElementById("month-group");
        const columnsGroup = document.getElementById("columns-group");
        if (state.view === "Year") {
          monthGroup == null ? void 0 : monthGroup.classList.add("hidden");
          columnsGroup == null ? void 0 : columnsGroup.classList.remove("hidden");
        } else {
          monthGroup == null ? void 0 : monthGroup.classList.remove("hidden");
          columnsGroup == null ? void 0 : columnsGroup.classList.add("hidden");
        }
      }
      function showError(message, isRaw) {
        if (isRaw) {
          document.body.innerHTML = `<pre style="color: red; font-family: monospace; padding: 2rem;">Error: ${message}</pre>`;
        } else {
          const errorDiv = document.getElementById("error-message");
          if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = "block";
          }
        }
      }
      function hideError() {
        const errorDiv = document.getElementById("error-message");
        if (errorDiv) errorDiv.style.display = "none";
      }
      function getShareableURL(state) {
        const url = new URL(window.location.href);
        url.searchParams.set("year", state.year.toString());
        if (state.view === "Month" && state.month) {
          url.searchParams.set("month", state.month.toString());
        } else {
          url.searchParams.delete("month");
        }
        url.searchParams.set("view", state.view);
        url.searchParams.set("startDay", state.startDay);
        url.searchParams.set("columns", state.columns.toString());
        url.searchParams.set("renderAs", state.renderAs);
        return url.toString();
      }
      function render(state, isRaw) {
        try {
          hideError();
          let outputContent = "";
          if (state.renderAs === "markdown") {
            const canonical = generateCalendarMarkdown(state);
            outputContent = zipRows(canonical, state, "markdown");
          } else if (state.renderAs === "text") {
            const canonical = generateCalendarText(state);
            outputContent = zipRows(canonical, state, "text");
          } else {
            const canonical = generateCalendarMarkdown(state);
            outputContent = renderMarkdownToHtml(canonical, state.view, state.columns);
          }
          if (isRaw) {
            document.body.className = "raw-mode";
            document.body.innerHTML = `<pre style="white-space: pre; font-family: monospace; margin: 0; padding: 2rem; overflow-x: auto;">${outputContent}</pre>`;
          } else {
            const output = document.getElementById("output");
            if (output) {
              if (state.renderAs === "markdown" || state.renderAs === "text") {
                output.innerHTML = `<pre id="raw-preview">${outputContent}</pre>`;
              } else {
                output.innerHTML = outputContent;
              }
            }
          }
        } catch (e) {
          showError(e.message, isRaw);
        }
      }
      function main() {
        var _a, _b, _c;
        initTheme();
        const params = getParams();
        const isRaw = !!(params.year && (params.month || params.view === "Year"));
        const now = /* @__PURE__ */ new Date();
        const state = {
          year: params.year || now.getFullYear(),
          month: params.month || now.getMonth() + 1,
          startDay: params.startDay || "Monday",
          view: params.view || "Month",
          columns: params.columns || 2,
          renderAs: params.renderAs || "html"
        };
        if (!isRaw) {
          updateUI(state);
          const el = (id) => document.getElementById(id);
          const inputs = ["year", "month", "startDay", "view", "columns", "renderAs"];
          const handleChange = () => {
            state.year = parseInt(el("year").value) || now.getFullYear();
            state.month = parseInt(el("month").value);
            state.startDay = el("startDay").value;
            state.view = el("view").value;
            const colVal = el("columns").value;
            state.columns = colVal === "continuous" ? "continuous" : parseInt(colVal);
            state.renderAs = el("renderAs").value;
            updateUI(state);
            render(state, false);
          };
          inputs.forEach((id) => {
            var _a2, _b2;
            (_a2 = el(id)) == null ? void 0 : _a2.addEventListener("input", handleChange);
            (_b2 = el(id)) == null ? void 0 : _b2.addEventListener("change", handleChange);
          });
          (_a = el("theme-toggle")) == null ? void 0 : _a.addEventListener("click", toggleTheme);
          (_b = el("copy-markdown-btn")) == null ? void 0 : _b.addEventListener("click", () => {
            const canonical = state.renderAs === "text" ? generateCalendarText(state) : generateCalendarMarkdown(state);
            const zipped = zipRows(canonical, state, state.renderAs === "text" ? "text" : "markdown");
            navigator.clipboard.writeText(zipped).then(() => alert(`${state.renderAs === "text" ? "Text" : "Markdown"} copied!`));
          });
          (_c = el("copy-link-btn")) == null ? void 0 : _c.addEventListener("click", () => {
            navigator.clipboard.writeText(getShareableURL(state)).then(() => alert("Shareable link (Raw Mode) copied!"));
          });
        }
        render(state, isRaw);
      }
      window.addEventListener("DOMContentLoaded", main);
    }
  });
  require_index();
})();
