import axios, { AxiosInstance, AxiosResponse } from 'axios';

export default class HttpService {
  private axiosInstance: AxiosInstance;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    if (!baseURL) {
      throw new Error('Base URL is not defined in the environment variables');
    }

    this.axiosInstance = axios.create({
      baseURL: baseURL,
      timeout: 10000, // Default timeout
    });
  }

  public async get<T>(endpoint: string): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.get<T>(endpoint);
    } catch (error) {
      throw new Error(`GET request failed: ${error}`);
    }
  }

  public async post<T>(endpoint: string, data: any): Promise<AxiosResponse<T>> {
    try {
      const isFormData = data instanceof FormData;
      return await this.axiosInstance.post<T>(endpoint, data, {
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        },
      });
    } catch (error) {
      throw new Error(`POST request failed: ${error}`);
    }
  }

  public async put<T>(endpoint: string, data: any): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.put<T>(endpoint, data);
    } catch (error) {
      throw new Error(`PUT request failed: ${error}`);
    }
  }

  public async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.delete<T>(endpoint);
    } catch (error) {
      throw new Error(`DELETE request failed: ${error}`);
    }
  }
}
