import { generateCalendarMarkdown, generateCalendarText, CalendarOptions, StartDay, View, zipRows } from './calendarGenerator';
import { renderMarkdownToHtml } from './markdownRenderer';

interface AppState extends CalendarOptions {
    renderAs: 'html' | 'markdown' | 'text';
}

function getParams() {
    const params = new URLSearchParams(window.location.search);
    const pYear = params.get('year');
    const pMonth = params.get('month');
    const pColumns = params.get('columns');
    const pRenderAs = params.get('renderAs');
    let columnsVal: number | 'continuous' | undefined = undefined;
    if (pColumns === 'continuous') {
        columnsVal = 'continuous';
    } else if (pColumns) {
        columnsVal = parseInt(pColumns);
    }
    
    return {
        year: pYear ? parseInt(pYear) : undefined,
        month: pMonth ? parseInt(pMonth) : undefined,
        startDay: params.get('startDay') as StartDay | null || undefined,
        view: params.get('view') as View | null || undefined,
        columns: columnsVal,
        renderAs: pRenderAs as 'html' | 'markdown' | 'text' | null || undefined,
    };
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

function updateUI(state: AppState) {
    const el = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
    
    if (el('year')) el('year').value = state.year.toString();
    if (el('month')) el('month').value = (state.month || 1).toString();
    if (el('startDay')) el('startDay').value = state.startDay;
    if (el('view')) el('view').value = state.view;
    if (el('columns')) el('columns').value = state.columns.toString();
    if (el('renderAs')) el('renderAs').value = state.renderAs;

    // Side effects based on view
    const monthGroup = document.getElementById('month-group');
    const columnsGroup = document.getElementById('columns-group');
    
    if (state.view === 'Year') {
        monthGroup?.classList.add('hidden');
        columnsGroup?.classList.remove('hidden');
    } else {
        monthGroup?.classList.remove('hidden');
        columnsGroup?.classList.add('hidden');
    }
}

function showError(message: string, isRaw: boolean) {
    if (isRaw) {
        document.body.innerHTML = `<pre style="color: red; font-family: monospace; padding: 2rem;">Error: ${message}</pre>`;
    } else {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }
}

function hideError() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) errorDiv.style.display = 'none';
}

function getShareableURL(state: AppState): string {
    const url = new URL(window.location.href);
    url.searchParams.set('year', state.year.toString());
    if (state.view === 'Month' && state.month) {
        url.searchParams.set('month', state.month.toString());
    } else {
        url.searchParams.delete('month');
    }
    url.searchParams.set('view', state.view);
    url.searchParams.set('startDay', state.startDay);
    url.searchParams.set('columns', state.columns.toString());
    url.searchParams.set('renderAs', state.renderAs);
    return url.toString();
}

function render(state: AppState, isRaw: boolean) {
    try {
        hideError();
        
        let outputContent = '';
        if (state.renderAs === 'markdown') {
            const canonical = generateCalendarMarkdown(state);
            outputContent = zipRows(canonical, state, 'markdown');
        } else if (state.renderAs === 'text') {
            const canonical = generateCalendarText(state);
            outputContent = zipRows(canonical, state, 'text');
        } else {
            // HTML mode always uses Markdown canonical for simplicity
            const canonical = generateCalendarMarkdown(state);
            outputContent = renderMarkdownToHtml(canonical, state.view, state.columns);
        }
        
        if (isRaw) {
            document.body.className = 'raw-mode';
            document.body.innerHTML = `<pre style="white-space: pre; font-family: monospace; margin: 0; padding: 2rem; overflow-x: auto;">${outputContent}</pre>`;
        } else {
            const output = document.getElementById('output');
            if (output) {
                if (state.renderAs === 'markdown' || state.renderAs === 'text') {
                    output.innerHTML = `<pre id="raw-preview">${outputContent}</pre>`;
                } else {
                    output.innerHTML = outputContent;
                }
            }
        }
    } catch (e: any) {
        showError(e.message, isRaw);
    }
}

function main() {
    initTheme();
    const params = getParams();
    const isRaw = !!(params.year && (params.month || params.view === 'Year'));

    const now = new Date();
    const state: AppState = {
        year: params.year || now.getFullYear(),
        month: params.month || (now.getMonth() + 1),
        startDay: params.startDay || 'Monday',
        view: params.view || 'Month',
        columns: params.columns || 2,
        renderAs: params.renderAs || 'html',
    };

    if (!isRaw) {
        updateUI(state);
        
        // Reactive listeners
        const el = (id: string) => document.getElementById(id);
        const inputs = ['year', 'month', 'startDay', 'view', 'columns', 'renderAs'];
        
        const handleChange = () => {
            state.year = parseInt((el('year') as HTMLInputElement).value) || now.getFullYear();
            state.month = parseInt((el('month') as HTMLSelectElement).value);
            state.startDay = (el('startDay') as HTMLSelectElement).value as StartDay;
            state.view = (el('view') as HTMLSelectElement).value as View;
            const colVal = (el('columns') as HTMLSelectElement).value;
            state.columns = colVal === 'continuous' ? 'continuous' : parseInt(colVal);
            state.renderAs = (el('renderAs') as HTMLSelectElement).value as 'html' | 'markdown' | 'text';
            
            updateUI(state);
            render(state, false);
        };

        inputs.forEach(id => {
            el(id)?.addEventListener('input', handleChange);
            el(id)?.addEventListener('change', handleChange);
        });

        el('theme-toggle')?.addEventListener('click', toggleTheme);

        el('copy-markdown-btn')?.addEventListener('click', () => {
            const canonical = state.renderAs === 'text' ? generateCalendarText(state) : generateCalendarMarkdown(state);
            const zipped = zipRows(canonical, state, state.renderAs === 'text' ? 'text' : 'markdown');
            navigator.clipboard.writeText(zipped).then(() => alert(`${state.renderAs === 'text' ? 'Text' : 'Markdown'} copied!`));
        });

        el('copy-link-btn')?.addEventListener('click', () => {
            navigator.clipboard.writeText(getShareableURL(state)).then(() => alert('Shareable link (Raw Mode) copied!'));
        });
    }

    render(state, isRaw);
}

window.addEventListener('DOMContentLoaded', main);
