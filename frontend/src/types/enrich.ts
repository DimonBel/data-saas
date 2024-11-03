
export interface EnrichmentOption {
    value: string;
    label: string;
    tooltip: string;
}

export interface Props {
    selectedColumn: string | null;
    enrichmentOptions: string[];
    onChange: (values: string[]) => void;
}
