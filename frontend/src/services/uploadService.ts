import { RcFile } from 'antd/es/upload/interface';
import { ApiRoutes } from '../app/api/apiRoutes';
import HttpService from './httpService';

class UploadService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  async uploadFileToStrapi(file: RcFile) {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const token = process.env.NEXT_PUBLIC_API_TOKEN;

      // Use the configuration object to add headers
      const config = {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      };

      // Pass the config object with headers as the second argument
      const response = await this.httpService.post<{ id: number; url: string }[]>(
        ApiRoutes.Upload,
        formData,
        config
      );
      
      const uploadedFiles = response.data;
      return uploadedFiles[0]; // Assume the first file is the one uploaded
    } catch (error: any) {
      console.error('File upload error:', error.response?.data || error.message);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async saveMetadataToStrapi(metadata: Record<string, any>, jsonData: any) {
    try {
      const payload = {
        data: {
          ...metadata,
          data: jsonData,
        },
      };

      const token = process.env.NEXT_PUBLIC_API_TOKEN;

      // Use the configuration object to add headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Pass the config object with headers as the second argument
      const response = await this.httpService.post<{ id: number }>(
        ApiRoutes.Datasets,
        payload,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error('Metadata save error:', error.response?.data || error.message);
      throw new Error(`Failed to save metadata: ${error.message}`);
    }
  }
}

export default UploadService;