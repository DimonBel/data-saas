"use client";

import React, { useState } from 'react';
import { Upload, Button, message, Form, Tag, Row, Col } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import { parseFileColumnsAndData } from '@/app/services/fileService';
import UploadService from '@/app/services/uploadService';
import { RcFile } from 'antd/es/upload/interface';
import "@/app/style/FileUploader.css";
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
    try {
      const parsedResult = await parseFileColumnsAndData(file);
      setColumns(parsedResult.columns);
      setParsedData(parsedResult.data);
      message.success('File parsed successfully');
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
      // Upload the file and get metadata
      const uploadedFile = await uploadService.uploadFileToStrapi(fileList[0] as RcFile);
      const datasetName = fileList[0].name.split('.').slice(0, -1).join('.');
      const uploadedAt = new Date().toISOString();

      const metadata = {
        filename: datasetName,
        columns: columns,
        uploaded: uploadedAt,
        filepath: uploadedFile.url,
        file: uploadedFile.id,
      };

      // Save metadata along with parsed data
      await uploadService.saveMetadataToStrapi(metadata, parsedData);
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
