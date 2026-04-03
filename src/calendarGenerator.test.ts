import { generateCalendarMarkdown, generateCalendarText, CalendarOptions, zipRows } from './calendarGenerator';

describe('calendarGenerator', () => {
  test('generates October 2024 with borders starting on Monday', () => {
    const options: CalendarOptions = {
      year: 2024,
      month: 10,
      startDay: 'Monday',
      view: 'Month',
      columns: 1
    };
    const markdown = generateCalendarMarkdown(options);
    expect(markdown).toContain('| Mon | Tue | Wed | Thu | Fri | Sat | Sun |');
    expect(markdown).toContain('|     |   1 |   2 |   3 |   4 |   5 |   6 |');
  });

  test('generates 8-column native table with ALL columns padded to 10 chars', () => {
    const options: CalendarOptions = {
        year: 2024,
        month: 1, 
        startDay: 'Monday',
        view: 'Year',
        columns: 2
    };
    const canonical = generateCalendarMarkdown(options);
    const zipped = zipRows(canonical, options, 'markdown');
    
    // Check for padded month name and padded empty cells in first row
    expect(zipped).toContain('| January    |            |            |');
    
    // Check for padded day names in third row
    expect(zipped).toContain('|            | Mon        | Tue        | Wed        | Thu        | Fri        | Sat        | Sun        |');
    
    // Check for padded separators in second row
    expect(zipped).toContain('| ---        | ---        | ---        | ---        | ---        | ---        | ---        | ---        |');
  });

  test('generates Simplified Text version with 3-char padding and centered markers', () => {
    const options: CalendarOptions = {
        year: 2024,
        month: 1,
        startDay: 'Monday',
        view: 'Year',
        columns: 2
    };
    const canonical = generateCalendarText(options);
    const zipped = zipRows(canonical, options, 'text');

    // Check for centered month name (January is 7 chars, 27 chars wide, left pad 10)
    expect(zipped).toContain('          January');
    
    // Check for day names (standard 3-char + gap)
    expect(zipped).toContain('Mon Tue Wed Thu Fri Sat Sun');
    
    // Check for dates (starting on index 4 for Jan 2024 Mon start)
    // Jan 1 2024 is Monday. Mon is index 0.
    expect(zipped).toContain('  1   2   3   4   5   6   7');
  });
});
