import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export async function POST(request: Request) {
    try {
        const { csvContent } = await request.json();

        const filename = `data_${Date.now()}.csv`;
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadsDir, filename);

        await mkdir(uploadsDir, { recursive: true });
        await writeFile(filePath, csvContent);

        const formData = new FormData();
        formData.append('files', fs.createReadStream(filePath));
        formData.append('filepath', `/uploads/${filename}`);

        const strapiResponse = await axios.post('http://localhost:1337/api/enriches', formData, {
            headers: {
                ...formData.getHeaders(),
                'Accept': 'application/json'
            }
        });

        return NextResponse.json({
            filePath: `/uploads/${filename}`,
            strapiResponse: strapiResponse.data
        }, { status: 200 });
    } catch (error) {
        console.error('Error saving CSV:', error.response ? error.response.data : error.message);
        return NextResponse.json({
            message: 'Error saving CSV file',
            error: error.response ? error.response.data : (error as Error).message
        }, { status: 500 });
    }
}
