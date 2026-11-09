export interface ReportSection {
    title: string;
    data: Record<string, any>[];
    emptyMessage: string;
    headers?: string[];
}

export interface ReportConfig {
    reportTitle: string;
    fileName: string;
    filters?: Record<string, string>;
    sections: ReportSection[];
    summary?: {
        title: string;
        data: [string, string | number][];
    };
}