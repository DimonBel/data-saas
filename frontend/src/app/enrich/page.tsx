"use client";

import React from 'react';
import AppLayout from '../components/MainPage/AppLayout';
import DisplayData from '../components/Table/DisplayData';
import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

const UploadPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="upload-section max-w-2xl bg-gray-800 rounded-lg p-8 shadow-lg text-center">
        <Title className="text-white">Dataset Enrichment</Title>
        <Paragraph className="text-gray-400 mb-6">
          Select a column to enrich with additional information.        </Paragraph>
        <DisplayData />
      </div>
    </AppLayout>
  );
};

export default UploadPage;
