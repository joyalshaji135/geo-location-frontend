import { useState, useEffect } from 'react';
import { apiService, type Country, type State, type District, type CountryStdCode } from '../services/apiService';

export const useLocationData = () => {
  // State for dropdown data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [countryStdCode, setCountryStdCode] = useState<CountryStdCode | null>(null);

  // State for selected values
  const [selectedCountry, setSelectedCountry] = useState<number | ''>('');
  const [selectedState, setSelectedState] = useState<number | ''>('');
  const [selectedDistrict, setSelectedDistrict] = useState<number | ''>('');

  // State for loading and errors
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

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch states when country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry);
      fetchCountryStdCode(selectedCountry);
      // Reset state and district when country changes
      setSelectedState('');
      setSelectedDistrict('');
      setDistricts([]);
    } else {
      setStates([]);
      setDistricts([]);
      setCountryStdCode(null);
    }
  }, [selectedCountry]);

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetchDistricts(selectedCountry, selectedState);
    } else {
      setDistricts([]);
    }
  }, [selectedState]);

  // API function to fetch countries
  const fetchCountries = async () => {
    setLoading(prev => ({ ...prev, countries: true }));
    setErrors(prev => ({ ...prev, countries: '' }));
    
    try {
      const data = await apiService.getCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setErrors(prev => ({ ...prev, countries: 'Failed to load countries' }));
    } finally {
      setLoading(prev => ({ ...prev, countries: false }));
    }
  };

  // API function to fetch states
  const fetchStates = async (countryId: number) => {
    setLoading(prev => ({ ...prev, states: true }));
    setErrors(prev => ({ ...prev, states: '' }));
    
    try {
      const data = await apiService.getStates(countryId);
      setStates(data);
    } catch (error) {
      console.error('Error fetching states:', error);
      setErrors(prev => ({ ...prev, states: 'Failed to load states' }));
    } finally {
      setLoading(prev => ({ ...prev, states: false }));
    }
  };

  // API function to fetch districts
  const fetchDistricts = async (countryId: number, stateId: number) => {
    setLoading(prev => ({ ...prev, districts: true }));
    setErrors(prev => ({ ...prev, districts: '' }));
    
    try {
      const data = await apiService.getDistricts(countryId, stateId);
      setDistricts(data);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setErrors(prev => ({ ...prev, districts: 'Failed to load districts' }));
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  // API function to fetch country STD code
  const fetchCountryStdCode = async (countryId: number) => {
    setLoading(prev => ({ ...prev, stdCode: true }));
    setErrors(prev => ({ ...prev, stdCode: '' }));
    
    try {
      const data = await apiService.getCountryStdCode(countryId);
      setCountryStdCode(data);
    } catch (error) {
      console.error('Error fetching country STD code:', error);
      setErrors(prev => ({ ...prev, stdCode: 'Failed to load country code' }));
    } finally {
      setLoading(prev => ({ ...prev, stdCode: false }));
    }
  };

  // Reset all data
  const resetForm = () => {
    setSelectedCountry('');
    setSelectedState('');
    setSelectedDistrict('');
    setCountryStdCode(null);
    setStates([]);
    setDistricts([]);
  };

  return {
    // Data
    countries,
    states,
    districts,
    countryStdCode,
    
    // Selected values
    selectedCountry,
    selectedState,
    selectedDistrict,
    setSelectedCountry,
    setSelectedState,
    setSelectedDistrict,
    
    // Loading states
    loading,
    
    // Error states
    errors,
    
    // Actions
    fetchCountries,
    fetchStates,
    fetchDistricts,
    fetchCountryStdCode,
    resetForm,
  };
};