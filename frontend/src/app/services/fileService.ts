import * as XLSX from 'xlsx';
import { RcFile } from 'antd/es/upload/interface';

export const parseFileColumnsAndData = (file: RcFile): Promise<{ columns: Array<{ original: string, transformed: string }>, data: any[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
          return reject('No sheet found in the workbook');
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[];

          // Формируем массив колонок с их оригинальными и трансформированными именами
          const orderedColumns: Array<{ original: string, transformed: string }> = headers.map((header: string) => ({
            original: header,
            transformed: header.toLowerCase().replace(/\s+/g, '_') // Преобразуем заголовок
          }));

          // Преобразуем строки данных (после заголовков)
          const rowData = jsonData.slice(1).map((row: any[]) => {
            return row;
          });

          resolve({
            columns: orderedColumns,
            data: rowData,
          });
        } else {
          reject('No data found in file');
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        reject('Failed to parse the file');
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject('File reading failed');
    };

    reader.readAsArrayBuffer(file);
  });
};
