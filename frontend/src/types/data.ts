export type DataItem ={
    // id: string;
    // Name?: string;
    // Email?: string;
    // Phone?: string;
    // LinkedIn?: string;
    // [key: string]: any; // To accommodate dynamic fields like Enriched data

    id: number;
    name: string;
    value: string;
    CarrierInfo?: string;
    PhoneType?: string;
    CountryInfo?: string;

}

export type ColumnItem ={
    title: React.ReactNode;
    dataIndex: string;
    key: string;
    width?: number;
    render?: (text: any) => React.ReactNode;
}
export type TogetherData ={
    id: string | number;
    Name?: string;
    Email?: string;
    Phone?: string;
}
