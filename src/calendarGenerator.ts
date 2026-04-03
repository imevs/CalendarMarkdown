export type StartDay = 'Monday' | 'Sunday';
export type View = 'Month' | 'Year';

export interface CalendarOptions {
  year: number;
  month: number;
  startDay: StartDay;
  view: View;
  columns: number | 'continuous';
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Returns canonical (vertical) markdown for the calendar.
 */
export function generateCalendarMarkdown(options: CalendarOptions): string {
  const { year, month, view } = options;

  if (options.columns === 'continuous' && view === 'Year') {
    return generateContinuousCalendar(options, 'markdown');
  }

  if (view === 'Year') {
    let result = `# Calendar ${year}\n\n`;
    for (let m = 1; m <= 12; m++) {
      result += `### ${MONTH_NAMES[m - 1]} ${year}\n\n`;
      result += renderMarkdownTable(generateMonthGrid(options, m));
      result += '\n\n';
    }
    return result.trim();
  } else {
    const m = month || (new Date().getMonth() + 1);
    const header = `### ${MONTH_NAMES[m - 1]} ${year}\n\n`;
    return header + renderMarkdownTable(generateMonthGrid(options, m));
  }
}

/**
 * Returns canonical (vertical) plain text for the calendar.
 */
export function generateCalendarText(options: CalendarOptions): string {
  const { year, month, view } = options;

  if (options.columns === 'continuous' && view === 'Year') {
    return generateContinuousCalendar(options, 'text');
  }

  if (view === 'Year') {
    let result = `${year} Calendar\n\n`;
    for (let m = 1; m <= 12; m++) {
      result += `${MONTH_NAMES[m - 1]} ${year}\n\n`;
      result += renderTextTable(generateMonthGrid(options, m));
      result += '\n\n';
    }
    return result.trim();
  } else {
    const m = month || (new Date().getMonth() + 1);
    const header = `${MONTH_NAMES[m - 1]} ${year}\n\n`;
    return header + renderTextTable(generateMonthGrid(options, m));
  }
}

function renderMarkdownTable(grid: string[][]): string {
  const pad = (s: string) => s.padStart(3, ' ');
  const header = grid[0] || [];
  let md = '| ' + header.map(pad).join(' | ') + ' |\n';
  md += '| ' + header.map(() => '---').join(' | ') + ' |\n';
  for (let i = 1; i < grid.length; i++) {
    const row = grid[i] || [];
    md += '| ' + row.map(pad).join(' | ') + ' |\n';
  }
  return md.trim();
}

function renderTextTable(grid: string[][]): string {
  const pad = (s: string) => s.padStart(3, ' ');
  const header = grid[0] || [];
  let txt = header.map(pad).join(' ') + '\n';
  txt += header.map(() => '---').join(' ') + '\n';
  for (let i = 1; i < grid.length; i++) {
    const row = grid[i] || [];
    txt += row.map(pad).join(' ') + '\n';
  }
  return txt.trim();
}

/**
 * Zips canonical layout into a multi-column format.
 */
export function zipRows(canonical: string, options: CalendarOptions, format: 'markdown' | 'text'): string {
  const { columns, view } = options;
  if (columns === 'continuous' || columns <= 1 || view === 'Month') return canonical;

  const separator = format === 'markdown' ? /(?=### )/ : new RegExp(`(?=(?:${MONTH_NAMES.join('|')}) \\d{4})`);
  const monthSections = canonical.split(separator).map(s => s.trim()).filter(s => s.length > 0);
  
  const firstSection = monthSections[0] || '';
  const isYearHeader = firstSection.includes('Calendar');
  
  let yearHeader = '';
  if (isYearHeader) {
    yearHeader = monthSections.shift() || '';
  }
  
  let result = yearHeader ? `${yearHeader.trim()}\n\n` : '';

  for (let i = 0; i < monthSections.length; i += columns) {
    const monthsInRow: { name: string, grid: string[][] }[] = [];
    
    for (let j = 0; j < columns && (i + j) < monthSections.length; j++) {
      const section = monthSections[i + j] || '';
      let monthName = '';
      if (format === 'markdown') {
        const match = section.match(/### (.*) \d{4}/);
        monthName = (match && match[1]) ? match[1] : '';
      } else {
        const match = section.match(/^([A-Za-z]+) \d{4}/);
        monthName = (match && match[1]) ? match[1] : '';
      }
      
      let gridLines: string[] = [];
      if (format === 'markdown') {
        gridLines = section.split('\n').filter(l => l.includes('|'));
      } else {
        const allLines = section.split('\n').filter(l => l.trim().length > 0);
        gridLines = allLines.slice(1);
      }

      const grid = gridLines.map(line => {
        if (format === 'markdown') {
          return line.split('|').map(c => c.trim()).slice(1, -1);
        } else {
          const cells: string[] = [];
          for (let k = 0; k < 7; k++) {
            cells.push(line.slice(k * 4, k * 4 + 3).trim());
          }
          return cells;
        }
      });
      
      monthsInRow.push({ name: monthName, grid });
    }

    if (monthsInRow.length === 0) continue;

    if (format === 'markdown') {
        // Markdown (8-column native table)
        const transformedGrids = monthsInRow.map(m => {
            const newGrid: string[][] = [];
            const pad10 = (s: string) => s.padEnd(10, ' ');
            newGrid.push([m.name, ...Array(7).fill('')].map(pad10));
            newGrid.push(Array(8).fill('---').map(pad10));
            m.grid.forEach((row, idx) => {
                const isSeparator = idx === 1 && row.every(c => c === '---' || c === '');
                if (isSeparator) return;
                newGrid.push(['', ...row].map(pad10));
            });
            return newGrid;
        });

        const maxHeight = Math.max(...transformedGrids.map(g => g.length));
        transformedGrids.forEach(g => {
            const pad10 = (s: string) => s.padEnd(10, ' ');
            while (g.length < maxHeight) g.push(Array(8).fill('').map(pad10));
        });

        for (let h = 0; h < maxHeight; h++) {
            const rowCells: string[] = [];
            transformedGrids.forEach((grid, gIdx) => {
                const row = grid[h] || Array(8).fill(''.padEnd(10, ' '));
                rowCells.push(...row);
                if (gIdx < transformedGrids.length - 1) {
                    rowCells.push(h === 1 ? '---' : '   ');
                }
            });
            result += '| ' + rowCells.join(' | ') + ' |\n';
        }
    } else {
        // Plain Text (Simplified 7-column)
        const transformedGrids = monthsInRow.map(m => {
            const newGrid: string[][] = [];
            const pad3 = (s: string) => s.padStart(3, ' ');
            // Centered Header across 27 chars (7*3 + 6 spaces)
            const headerText = m.name;
            const leftPad = Math.floor((27 - headerText.length) / 2);
            const centeredHeader = [' '.repeat(leftPad) + headerText + ' '.repeat(27 - leftPad - headerText.length)];
            newGrid.push(centeredHeader);
            
            // Separator
            newGrid.push([' '.repeat(27)]); 
            
            // Body
            m.grid.forEach((row, idx) => {
                const isSeparator = idx === 1 && row.every(c => c === '---' || c === '');
                if (isSeparator) return;
                newGrid.push([row.map(pad3).join(' ')]);
            });
            return newGrid;
        });

        const maxHeight = Math.max(...transformedGrids.map(g => g.length));
        transformedGrids.forEach(g => {
            while (g.length < maxHeight) g.push([' '.repeat(27)]);
        });

        for (let h = 0; h < maxHeight; h++) {
            let rowStr = '  ';
            transformedGrids.forEach((grid, gIdx) => {
                const row = grid[h] || [' '.repeat(27)];
                rowStr += row[0];
                if (gIdx < transformedGrids.length - 1) {
                    rowStr += '    '; // Gap between months
                }
            });
            result += rowStr.trimEnd() + '\n';
        }
    }
    result += '\n';
  }
  return result.trim();
}

function generateMonthGrid(options: CalendarOptions, m: number): string[][] {
  const { year, startDay } = options;
  const daysInMonth = new Date(year, m, 0).getDate();
  const firstDayOfMonth = new Date(year, m - 1, 1).getDay();

  let offset = firstDayOfMonth;
  if (startDay === 'Monday') {
    offset = (firstDayOfMonth + 6) % 7;
  }

  const dayNames = startDay === 'Monday'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const grid: string[][] = [dayNames];
  let currentDay = 1;
  let row = Array(7).fill('');
  for (let i = offset; i < 7; i++) {
    row[i] = currentDay.toString();
    currentDay++;
  }
  grid.push(row);

  while (currentDay <= daysInMonth) {
    row = Array(7).fill('');
    for (let i = 0; i < 7 && currentDay <= daysInMonth; i++) {
      row[i] = currentDay.toString();
      currentDay++;
    }
    grid.push(row);
  }
  return grid;
}

function generateContinuousCalendar(options: CalendarOptions, format: 'markdown' | 'text'): string {
  const { year, startDay } = options;
  const isMondayStart = startDay === 'Monday';
  
  const dayHeaders = isMondayStart 
    ? ['  M', '  T', '  W', '  T', '  F', '  S', '  S']
    : ['  S', '  M', '  T', '  W', '  T', '  F', '  S'];
    
  let md = '';
  if (format === 'markdown') {
    md += `# Calendar ${year}\n\n`;
    md += `|  W |   Month | ${dayHeaders.join(' | ')} |\n`;
    md += `| --:| -------:| -----:| -----:| -----:| -----:| -----:| -----:| -----:|\n`;
  } else {
    md += `${year} Calendar\n\n`;
    md += `  W    Month   ${dayHeaders.join('   ')}\n`;
    md += ` --  -------   ---   ---   ---   ---   ---   ---   ---\n`;
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
            rowDays.push(d.getDate().toString().padStart(2, ' '));
            
            if (rowMonth === -1 || d.getDate() === 1) {
                rowMonth = d.getMonth();
            }
        } else {
            rowDays.push('  ');
        }
    }
    
    if (weekContainsCurrentYear) {
      let monthLabel = '     ';
      if (rowMonth !== -1 && rowMonth !== lastPrintedMonth) {
        lastPrintedMonth = rowMonth;
        const monthShort = (MONTH_NAMES[rowMonth] || '').substring(0, 3).toUpperCase();
        monthLabel = format === 'markdown' ? `**${monthShort}**` : monthShort.padEnd(5, ' ');
        if (format === 'markdown') {
            monthLabel = monthLabel.padStart(7, ' ');
        }
      } else {
        monthLabel = format === 'markdown' ? '       ' : '     ';
      }
      
      const wStr = weekNum.toString().padStart(2, '0');
      
      if (format === 'markdown') {
        const dayStrs = rowDays.map(d => d.padStart(5, ' '));
        md += `| ${wStr} | ${monthLabel} | ${dayStrs.join(' | ')} |\n`;
      } else {
        const dayStrs = rowDays.map(d => d.padStart(3, ' '));
        const mLabel = monthLabel.padStart(7, ' ');
        md += ` ${wStr}    ${mLabel}   ${dayStrs.join('   ')}\n`;
      }
      weekNum++;
    }
    currentWeekStart = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + 7);
  }
  
  return md.trim();
}
