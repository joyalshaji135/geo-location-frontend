import axios from 'axios';

// Get environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const APP_VERSION = import.meta.env.VITE_APP_VERSION;

// Determine if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: isDevelopment ? '' : API_BASE_URL, // Use empty string in development to leverage proxy
  headers: {
    'x-api-key': API_KEY,
    'x-app-version': APP_VERSION,
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    if (isDevelopment) {
      console.log(`Making API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Interfaces
export interface Country {
  countrycode: number;
  countryname: string;
  stdcode: number;
  shortnm: string | null;
}

export interface State {
  countryID: number;
  stateID: number;
  stateName: string;
}

export interface District {
  countryID: number;
  stateID: number;
  cityID: number;
  cityName: string;
}

export interface CountryStdCode {
  countrycode: number;
  countryname: string;
  stdcode: number;
  shortnm: string;
  countryLogo: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

// API service functions
export const apiService = {
  // Fetch all countries
  async getCountries(): Promise<Country[]> {
    try {
      const response = await apiClient.get<ApiResponse<{ country: Country[] }>>('/api/country');
      if (response.data.success) {
        return response.data.data.country;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw new Error('Failed to fetch countries. Please check if the server is running.');
    }
  },

  // Fetch states by country ID
  async getStates(countryId: number): Promise<State[]> {
    try {
      const response = await apiClient.get<ApiResponse<State[]>>(`/api/state/${countryId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Error fetching states:', error);
      throw new Error('Failed to fetch states.');
    }
  },

  // Fetch districts by country ID and state ID
  async getDistricts(countryId: number, stateId: number): Promise<District[]> {
    try {
      const response = await apiClient.get<ApiResponse<District[]>>(`/api/district/${countryId}/${stateId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw new Error('Failed to fetch districts.');
    }
  },

  // Fetch country STD code by country ID
  async getCountryStdCode(countryId: number): Promise<CountryStdCode> {
    try {
      const response = await apiClient.get<ApiResponse<CountryStdCode[]>>(`/api/country-std-code/${countryId}`);
      if (response.data.success && response.data.data.length > 0) {
        return response.data.data[0];
      }
      throw new Error('Country code not found');
    } catch (error) {
      console.error('Error fetching country STD code:', error);
      throw new Error('Failed to fetch country code.');
    }
  },
};

// Utility function to check if environment variables are set
export const validateEnvVariables = (): void => {
  const required = {
    'VITE_API_BASE_URL': import.meta.env.VITE_API_BASE_URL,
    'VITE_API_KEY': import.meta.env.VITE_API_KEY,
    'VITE_APP_VERSION': import.meta.env.VITE_APP_VERSION,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
};

// Test server connection
export const testServerConnection = async (): Promise<boolean> => {
  try {
    await apiClient.get('/api/country');
    return true;
  } catch (error) {
    console.error('Server connection test failed:', error);
    return false;
  }
};