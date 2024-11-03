import axios from 'axios';

interface Column {
    original: string;
    transformed: string;
}

interface Dataset {
    id: number;
    attributes: {
        filename: string;
        filepath: string;
        uploaded: string;
        columns: Column[]; // Update column type to match the new structure
        data: (string | number | null)[][];
    };
}

interface ApiResponse {
    data: Dataset[];
}

export const fetchData = async () => {
    try {
        const response = await axios.get<ApiResponse>('http://localhost:1337/api/datasets/?sort[0]=id:desc&pagination[pageSize]=1');
        const result = response.data;

        if (result.data && result.data.length > 0) {
            const dataset = result.data[0];
            const columnsArray: Column[] = dataset.attributes.columns;
            const data: (string | number | null)[][] = dataset.attributes.data;

            // Create an array of original column names
            const columnOrder: string[] = columnsArray.map(column => column.original);

            // Mapping the original data into the desired JSON structure
            const formattedData = data
                .filter(row => row.length > 0) // Filter out any empty rows
                .map((row: (string | number | null)[]) => {
                    const rowData: Record<string, any> = {};
                    columnOrder.forEach((columnName, index) => {
                        rowData[columnName] = row[index];
                    });
                    return rowData;
                });

            // Return only the new formatted data
            return formattedData;
        }

        throw new Error('No data found');
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error fetching data: ${error.message}`);
        } else {
            throw new Error('Unknown error occurred while fetching data');
        }
    }
};
