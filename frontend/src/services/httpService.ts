import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

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

  public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.get<T>(endpoint, config);
    } catch (error) {
      throw new Error(`GET request failed: ${error}`);
    }
  }

  public async post<T>(
    endpoint: string,
    data: any,
    config?: AxiosRequestConfig // Optional config to allow headers or other options
  ): Promise<AxiosResponse<T>> {
    try {
      const isFormData = data instanceof FormData;
      const headers = {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        "Access-Control-Allow-Headers" : "Content-Type",
              "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH",
        ...(config?.headers || {}), // Merge with any provided headers
      };

      return await this.axiosInstance.post<T>(endpoint, data, { ...config, headers });
    } catch (error: any) {
      console.error('POST request error:', error.response?.data || error.message);
      throw new Error(`POST request failed: ${error.message}`);
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