const MONTH_NAMES = ['January', 'February', 'March'];
const str = "January 2024\n\nfoo\n\nFebruary 2024\n\nbar";
const separator = new RegExp(`(?=(?:${MONTH_NAMES.join('|')}) \\d{4})`);
console.log(str.split(separator));
