"use client";

import React from 'react';
import AppLayout from '../../components/MainPage/AppLayout';
import { Typography, Button } from 'antd';
import TogetherTable from '../../components/Table/TogetherTable';

const { Title, Paragraph } = Typography;

const UploadPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="upload-section max-w-2xl bg-gray-800 rounded-lg p-8 shadow-lg text-center">
        <Title className="text-white">Dataset Preview</Title>
        <Paragraph className="text-gray-400 mb-6">
          Preview data after column matching.        </Paragraph>
        <TogetherTable />
      </div>
    </AppLayout>
  );
};

export default UploadPage;