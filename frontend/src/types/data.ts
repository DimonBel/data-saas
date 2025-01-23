export type DataItem ={
    // id: string;
    // Name?: string;
    // Email?: string;
    // Phone?: string;
    // LinkedIn?: string;
    // [key: string]: any; // To accommodate dynamic fields like Enriched data

    id?: number;
    name?: string;
    value?: string;
    CarrierInfo?: string;
    PhoneType?: string;
    Phone?: string;
    CountryInfo?: string;
    LinkedIn?: string;
    About?: string;
    Honors?: string;
    Certifications?: string;
    Projects?: string;
    Skills?: string;
    Experience?: string;
    Education?: string;

    Company?: string;
    CompanyDomain?: string;
    CompanyIndustry?: string;
    Location?: string;
    City?: string;
    Country?: string;
}

export type ColumnItem ={
    title: string;
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
