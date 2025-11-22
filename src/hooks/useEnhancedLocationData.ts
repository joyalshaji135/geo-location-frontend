// src/hooks/useEnhancedLocationData.ts
import { useState, useEffect, useCallback } from 'react';
import { enhancedApiService } from '../services/enhancedApiService';
import { performanceService } from '../services/performanceService';

interface LocationData {
  countries: any[];
  states: any[];
  districts: any[];
  countryStdCode: any;
  selectedCountry: number | '';
  selectedState: number | '';
  selectedDistrict: number | '';
  setSelectedCountry: (country: number | '') => void;
  setSelectedState: (state: number | '') => void;
  setSelectedDistrict: (district: number | '') => void;
  loading: {
    countries: boolean;
    states: boolean;
    districts: boolean;
    stdCode: boolean;
  };
  errors: {
    countries: string;
    states: string;
    districts: string;
    stdCode: string;
  };
  resetForm: () => void;
  clearCache: () => void;
  cacheStats: {
    size: number;
    keys: string[];
  };
}

export const useEnhancedLocationData = (): LocationData => {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [countryStdCode, setCountryStdCode] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | ''>('');
  const [selectedState, setSelectedState] = useState<number | ''>('');
  const [selectedDistrict, setSelectedDistrict] = useState<number | ''>('');
  
  const [loading, setLoading] = useState({
    countries: false,
    states: false,
    districts: false,
    stdCode: false
  });
  
  const [errors, setErrors] = useState({
    countries: '',
    states: '',
    districts: '',
    stdCode: ''
  });

  const [cacheStats] = useState({
    size: 0,
    keys: []
  });

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      const endTimer = performanceService.startTimer('load_countries');
      setLoading(prev => ({ ...prev, countries: true }));
      setErrors(prev => ({ ...prev, countries: '' }));

      try {
        const countriesData = await enhancedApiService.getCountries();
        setCountries(countriesData);
        endTimer();
      } catch (error) {
        setErrors(prev => ({ ...prev, countries: 'Failed to load countries' }));
        console.error('Error loading countries:', error);
      } finally {
        setLoading(prev => ({ ...prev, countries: false }));
      }
    };

    loadCountries();
  }, []);

  // Load states when country is selected
  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      return;
    }

    const loadStates = async () => {
      const endTimer = performanceService.startTimer('load_states');
      setLoading(prev => ({ ...prev, states: true }));
      setErrors(prev => ({ ...prev, states: '' }));

      try {
        const statesData = await enhancedApiService.getStates(selectedCountry);
        setStates(statesData);
        endTimer();
      } catch (error) {
        setErrors(prev => ({ ...prev, states: 'Failed to load states' }));
        console.error('Error loading states:', error);
      } finally {
        setLoading(prev => ({ ...prev, states: false }));
      }
    };

    loadStates();
  }, [selectedCountry]);

  // Load districts when state is selected
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      return;
    }

    const loadDistricts = async () => {
      const endTimer = performanceService.startTimer('load_districts');
      setLoading(prev => ({ ...prev, districts: true }));
      setErrors(prev => ({ ...prev, districts: '' }));

      try {
        const districtsData = await enhancedApiService.getDistricts(selectedState);
        setDistricts(districtsData);
        endTimer();
      } catch (error) {
        setErrors(prev => ({ ...prev, districts: 'Failed to load districts' }));
        console.error('Error loading districts:', error);
      } finally {
        setLoading(prev => ({ ...prev, districts: false }));
      }
    };

    loadDistricts();
  }, [selectedState]);

  // Load STD code when country is selected
  useEffect(() => {
    if (!selectedCountry) {
      setCountryStdCode(null);
      return;
    }

    const loadStdCode = async () => {
      const endTimer = performanceService.startTimer('load_std_code');
      setLoading(prev => ({ ...prev, stdCode: true }));
      setErrors(prev => ({ ...prev, stdCode: '' }));

      try {
        const stdCodeData = await enhancedApiService.getStdCode(selectedCountry);
        setCountryStdCode(stdCodeData);
        endTimer();
      } catch (error) {
        setErrors(prev => ({ ...prev, stdCode: 'Failed to load country code' }));
        console.error('Error loading STD code:', error);
      } finally {
        setLoading(prev => ({ ...prev, stdCode: false }));
      }
    };

    loadStdCode();
  }, [selectedCountry]);

  const resetForm = useCallback(() => {
    setSelectedCountry('');
    setSelectedState('');
    setSelectedDistrict('');
    setStates([]);
    setDistricts([]);
    setCountryStdCode(null);
  }, []);

  const clearCache = useCallback(() => {
    enhancedApiService.clearCache();
    // Refresh cache stats
    // This would need to be implemented based on your cache service
  }, []);

  return {
    countries,
    states,
    districts,
    countryStdCode,
    selectedCountry,
    selectedState,
    selectedDistrict,
    setSelectedCountry,
    setSelectedState,
    setSelectedDistrict,
    loading,
    errors,
    resetForm,
    clearCache,
    cacheStats
  };
};