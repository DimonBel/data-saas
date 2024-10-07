import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

export interface Dataset {
  id: number;
  attributes: {
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    originalFile: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
        };
      };
    };
    enrichedFile: {
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
        };
      };
    };
  };
}

export const fetchDatasets = async (): Promise<Dataset[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/datasets?populate=*`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching datasets:', error);
    throw error;
  }
};

export const getFileUrl = (file: any) => 
  file?.data ? `${API_URL}${file.data.attributes.url}` : null;
