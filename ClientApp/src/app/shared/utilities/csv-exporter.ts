/**
 * Escapes a cell value to prevent CSV formatting issues.
 */
function sanitizeCsvCell(value: any): string {
    if (value === null || value === undefined) return '""';
    const str = String(value);
    // If string contains commas, double quotes, or newlines, enclose in quotes and escape internal quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
}

/**
 * Converts a 2D array of rows into a CSV string.
 */
export function buildCsvContent(rows: (string | number)[][]): string {
    return rows
        .map(row => row.map(cell => sanitizeCsvCell(cell)).join(','))
        .join('\r\n');
}

/**
 * Triggers a browser download of CSV string data.
 */
export function downloadCsv(csvContent: string, fileName: string): void {
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}