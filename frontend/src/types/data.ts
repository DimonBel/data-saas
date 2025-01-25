export interface DataItem {
    id?: string;
    Name?: string;
    Email?: string;
    Phone?: string;
    LinkedIn?: string;
    [key: string]: any; // To accommodate dynamic fields like Enriched data
}

export interface ColumnItem {
    title?: React.ReactNode;
    dataIndex?: string;
    key?: string;
    width?: number;
    render?: (text: any) => React.ReactNode;
}
export interface TogetherData {
    id?: string | number;
    Name?: string;
    Email?: string;
    Phone?: string;
}
