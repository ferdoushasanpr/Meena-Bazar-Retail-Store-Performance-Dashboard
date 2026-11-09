import { Injectable } from '@angular/core';
import { formatDate } from '../../shared/utilities/date';
import { buildCsvContent, downloadCsv } from '../../shared/utilities/csv-exporter';
import { ReportConfig } from '../shared/models/report';


@Injectable({
    providedIn: 'root'
})
export class ReportExporter {
    export(config: ReportConfig): void {
        const rows: (string | number)[][] = [];

        // Report metadata
        rows.push([config.reportTitle]);
        rows.push(['Generated Date', formatDate(new Date())]);

        if (config.filters) {
            Object.entries(config.filters).forEach(([key, value]) => {
                rows.push([key, value]);
            });
        }

        rows.push([]);

        // Summary section
        if (config.summary) {
            rows.push([`--- ${config.summary.title} ---`]);
            rows.push(['Metric', 'Value']);

            config.summary.data.forEach(([metric, value]) => {
                rows.push([metric, value]);
            });

            rows.push([]);
        }

        // Report sections
        config.sections.forEach(section => {
            rows.push([`--- ${section.title} ---`]);

            if (section.data.length > 0) {
                const headers = section.headers ?? Object.keys(section.data[0]);

                rows.push(headers);

                section.data.forEach(item => {
                    rows.push(headers.map(header => item[header] ?? ''));
                });
            } else {
                rows.push([section.emptyMessage]);
            }

            rows.push([]);
        });

        const csvContent = buildCsvContent(rows);
        const fileName = `${config.fileName}_${formatDate(new Date())}.csv`;

        downloadCsv(csvContent, fileName);
    }
}
