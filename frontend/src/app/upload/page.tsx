"use client";

import React from 'react';
import AppLayout from '../../components/MainPage/AppLayout';
import FileUploader from "@/components/FileUpload/FileUploader"
import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

const UploadPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="upload-section max-w-2xl bg-gray-800 rounded-lg p-8 shadow-lg text-center">
        <Title className="text-white">Dataset Enrichment</Title>
        <Paragraph className="text-gray-400 mb-6">
          Upload datasets related to organizations or people, match columns within the dataset, and enrich the data using AI-driven prompts.
        </Paragraph>
        <FileUploader />
      </div>
    </AppLayout>
  );
};

export default UploadPage;