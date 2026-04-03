export function renderMarkdownToHtml(
  markdown: string, 
  view: 'Month' | 'Year',
  columns: number | 'continuous'
): string {
  if (view === 'Month') {
    const lines = markdown.trim().split('\n');
    const firstLine = lines[0] || '';
    const header = firstLine.startsWith('### ') ? lines.shift() || '' : '';
    const content = lines.join('\n');
    return `
      <div class="month-card">
        ${header ? `<h3 style="margin-top: 0;">${header.replace('### ', '')}</h3>` : ''}
        ${renderMonth(content)}
      </div>
    `;
  }

  if (columns === 'continuous') {
    const lines = markdown.trim().split('\n');
    const firstLine = lines[0] || '';
    const yearHeader = firstLine.startsWith('# ') ? lines.shift() || '' : '';
    const content = lines.join('\n');
    return `
      <div class="year-view">
        ${yearHeader ? `<h1>${yearHeader.replace('# ', '')}</h1>` : ''}
        ${renderMonth(content)}
      </div>
    `;
  }

  // Year View: Split by headers
  const monthSections = markdown.split(/(?=### )/);
  const firstSection = monthSections[0] || '';
  const yearHeader = firstSection.startsWith('# ') ? monthSections.shift() : '';
  
  const gridStyle = `display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 2rem;`;
  
  const renderedMonths = monthSections.map(section => {
    const lines = section.split('\n');
    const header = lines.shift() || '';
    const content = lines.join('\n');
    return `
      <div class="month-card">
        <h3 style="margin-top: 0;">${header.replace('### ', '')}</h3>
        ${renderMonth(content)}
      </div>
    `;
  }).join('');

  return `
    <div class="year-view">
      ${yearHeader ? `<h1>${yearHeader.replace('# ', '')}</h1>` : ''}
      <div style="${gridStyle}">
        ${renderedMonths}
      </div>
    </div>
  `;
}

function renderMonth(markdown: string): string {
  const allLines = markdown.trim().split('\n');
  
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const altDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const startIdx = allLines.findIndex(line => {
    const t = line.trim();
    if (t.startsWith('|')) return true;
    return t.includes('|') && (dayNames.some(d => t.includes(d)) || altDayNames.some(d => t.includes(d)));
  });

  if (startIdx === -1) {
    return `<pre style="font-family: 'JetBrains Mono', monospace; padding: 1rem; background: rgba(0,0,0,0.1); border-radius: 8px; overflow-x: auto; margin: 0;">${markdown.trim()}</pre>`;
  }

  const tableLines = allLines.slice(startIdx);
  if (tableLines.length < 2) return `<pre>${tableLines.join('\n')}</pre>`;

  const getCells = (line: string) => {
    let cells = line.split('|');
    if (line.startsWith('|')) cells.shift();
    if (line.endsWith('|')) cells.pop();
    return cells.map(c => c.trim());
  };

  const headerCells = getCells(tableLines[0] || '');
  const header = headerCells.map(s => `<th>${s}</th>`).join('');
  
  const rows = tableLines.slice(2).map(line => {
    const rowCells = getCells(line);
    if (rowCells.length === 0) return '';
    const cells = rowCells.map(s => {
      const formatted = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return `<td>${formatted}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).filter(row => row !== '').join('');

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
