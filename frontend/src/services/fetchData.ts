import axios from 'axios';

interface RowAttributes {
    row_index: number;
    [key: string]: string | number | null;
}

interface Row {
    id: number;
    attributes: RowAttributes;
}

interface Dataset {
    id: number;
    attributes: {
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        uploaded: string;
        columns: string[];
        filename: string;
        rows: {
            data: Row[];
        };
    };
}

interface ApiResponse {
    data: Dataset[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export const fetchData = async () => {
    try {
        const response = await axios.get<ApiResponse>('http://localhost:1337/api/datasets?populate=*');
        const result = response.data;

        if (result.data && result.data.length > 0) {
            const dataset = result.data[0]; // Get the first dataset
            const columns = dataset.attributes.columns; // Array of column names
            const rows = dataset.attributes.rows.data; // Array of row objects

            // Map rows into the desired JSON structure
            const formattedData = rows.map(row => {
                const rowData: Record<string, any> = {};
                columns.forEach(column => {
                    rowData[column] = row.attributes[column] ?? null; // Map each column to the corresponding row attribute
                });
                return rowData;
            });

            return formattedData; // Return the new formatted data
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
