import React, { useState, useEffect } from 'react';
import { Upload, Button, message, Form, Tag, Row, Col } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { UploadFile, RcFile } from 'antd/es/upload/interface';
import Papa from 'papaparse';
import UploadService from '@/services/uploadService';
import "@/style/FileUploader.css";
import { useRouter } from 'next/navigation';

const { Dragger } = Upload;

const FileUploader: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<Record<string, string>>({});
  const [parsedData, setParsedData] = useState<any[]>([]);
  const uploadService = new UploadService();
  const router = useRouter();
  const columnSuggestions = [
    'email', 'function', 'location',
    'country', 'first_name', 'last_name',
    'phone', 'language', 'gender', 'birth_date'
  ];

  const [user, setUser] = useState<any>(null);

  const uploadProps = {
    accept: '.csv, .xls, .xlsx',
    beforeUpload: (file: RcFile) => {
      const isCSVorExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'text/csv';

      if (!isCSVorExcel) {
        message.error('You can only upload CSV or Excel files!');
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      handleParseColumns(file);
      return false; // Prevent automatic upload
    },
    fileList,
    multiple: false,
    onRemove: (file: UploadFile) => {
      setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
    },
  };

  const handleParseColumns = async (file: RcFile) => {
    console.log("intra in handleParseColumns");
    try {
      const parseFile = (file: RcFile): Promise<{ columns: string[]; data: any[] }> =>
        new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result: any) => {
              if (result.errors.length) {
                reject(result.errors);
              } else {
                const columns = Object.keys(result.data[0] || {});
                const data = result.data;
                resolve({ columns, data });
              }
            },
            error: (error: any) => reject(error),
          });
        });

      const parsedResult = await parseFile(file);
      setColumns(parsedResult.columns.reduce((acc, col) => ({ ...acc, [col]: col }), {}));
      setParsedData(parsedResult.data);
      message.success('File parsed successfully');
      console.log("the parsed file: ", parsedResult);
    } catch (error) {
      message.error('Failed to parse columns');
      console.error('Parse error:', error);
    }
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error('Please select a file before submitting!');
      return;
    }

    setLoading(true);

    try {
      // Upload the file to Strapi
      // const uploadedFile = await uploadService.uploadFileToStrapi(fileList[0] as RcFile);
      const datasetName = fileList[0].name.split('.').slice(0, -1).join('.');
      const uploadedAt = new Date().toISOString();

      // Save Dataset metadata to Strapi
      const datasetMetadata = {
        data: {
          filename: datasetName,
          columns: Object.keys(columns),  // Column names
          uploaded: uploadedAt,
          // filepath: uploadedFile.url,
          // file: uploadedFile.id, // File ID from media upload
          user: 2,
        }
      };
      
      console.log("!!!!!!!    ", datasetMetadata)
      
      
      // Create Dataset entity in Strapi
      const datasetResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}datasets`, {
        method: 'POST',
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
             "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH"
        },
        body: JSON.stringify(datasetMetadata),
      });

      console.log(datasetResponse)

      const dataset = await datasetResponse.json();
      console.log("!!!!!   dataset: ", dataset)
      const datasetId = dataset?.data?.id;
      

      // Save parsed rows to Strapi
      let rowCntr = 0;
      for (const row of parsedData) {
        rowCntr++;
        console.log("!!!! the row:  ", row);
        const rowData = {
          data: {
            dataset: datasetId,  // Linking row to dataset
            row_index: rowCntr,
            name: row.Name,  
            surname: row.Surname,
            language: row.Language,
            phone: row.Phone,
            country: row.Country,
            function: row.Function,
            gender: row.Gender,
          }
        };

        const rowResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}rows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`, // Use token from .env.local
          },
          body: JSON.stringify(rowData),
        });

        const rowResult = await rowResponse.json();
        if (!rowResponse.ok) {
          console.error('Error creating row:', rowResult);
        }
      }

      message.success('File and metadata saved successfully');
      setFileList([]);
      router.push('/preview');
    } catch (error: any) {
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <h2 style={{ color: '#e5e7eb' }}>Upload CSV or Excel File</h2>
      <Form layout="vertical">
        <Form.Item label={<span style={{ color: '#e5e7eb' }}>File</span>}>
          <Dragger {...uploadProps} style={{ backgroundColor: '#2d2d2d', borderColor: '#BFAFF2', color: '#BFAFF2' }}>
            <p className="ant-upload-drag-icon" style={{ color: '#BFAFF2' }}>
              <InboxOutlined style={{ color: '#BFAFF2' }} />
            </p>
            <p className="ant-upload-text" style={{ color: '#e5e7eb', marginBottom: '14px' }}>
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint" style={{ color: '#9a9a9a', marginBottom: '24px' }}>
              Support for a single upload. Please select a CSV or Excel file.
            </p>
            <div style={{ marginBottom: '14px', color: '#e5e7eb' }}>
              <p style={{ color: '#e5e7eb', marginBottom: '8px' }}>
                Upload a CSV file with this recommended layout:
              </p>
              <Row gutter={[8, 8]}>
                {columnSuggestions.map((col, index) => (
                  <Col key={index}>
                    <Tag color="geekblue" style={{ backgroundColor: '#BFAFF2', color: '#2d2d2d', fontWeight: 'bold' }}>
                      {col}
                    </Tag>
                  </Col>
                ))}
              </Row>
              <p style={{ color: '#9a9a9a', marginTop: '8px' }}>
                All elements except these will be inserted as additional extra fields.
              </p>
            </div>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={fileList.length === 0}
            style={{
              backgroundColor: fileList.length === 0 ? '#4e4e4e' : '#BFAFF2',
              borderColor: fileList.length === 0 ? '#4e4e4e' : '#BFAFF2',
              color: fileList.length === 0 ? '#b1b1b1' : '#fff'
            }}
          >
            Upload
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FileUploader;