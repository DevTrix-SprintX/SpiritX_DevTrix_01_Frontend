import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Route, useNavigate } from 'react-router-dom';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private axiosInstance: AxiosInstance;
  
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        
        // Attach token to headers if exists
        if (token) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
      },
      (error:Error) => {
        return Promise.reject(error);
      }
    );
    
    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response:AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        
        // Pre-handle different error status codes
        
        if (error.response) {
          const { status } = error.response;
          
          // Handle 401 Unauthorized
          if (status === 401) {
              window.location.href = '/login';
          }
          
          // Handle 403 Forbidden
          if (status === 403) {
            console.error('Permission denied');
            navigate('/403');
          }
          
          // Handle 500 and other server errors
          if (status >= 500) {
            console.error('Server error occurred');
             //TODO: Show a toast notification
          }
        } else if (error.request) {
          console.error('No response received from server');
          //TODO: Show a toast notification
        } else {
          console.error('Error setting up request:', error.message);
          //TODO: Show a toast notification
        }
        return Promise.reject(error);
      }
    );
  }
  
  // Generic request method
  public async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.request<T>(config);
  }
  
  // GET method
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    console.log('GET response:', response);
    return response.data;
  }
  
  // POST method
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }
  
  // PUT method
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }
  
  // PATCH method
  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }
  
  // DELETE method
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

const apiService = new ApiService();

export default apiService;