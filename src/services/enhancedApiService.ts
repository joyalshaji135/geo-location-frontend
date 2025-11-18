// src/services/enhancedApiService.ts
import { cacheService } from './cacheService';
import { performanceService } from './performanceService';

const CACHE_KEYS = {
  COUNTRIES: 'countries',
  STATES: (countryCode: number) => `states_${countryCode}`,
  DISTRICTS: (stateId: number) => `districts_${stateId}`,
  STD_CODE: (countryCode: number) => `std_code_${countryCode}`
};

export const enhancedApiService = {
  async getCountries() {
    const cacheKey = CACHE_KEYS.COUNTRIES;
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      console.log('📦 Serving countries from cache');
      return cached;
    }

    console.log('🌐 Fetching countries from API');
    const countries = await performanceService.measureApiCall(
      'getCountries',
      fetch('/api/countries').then(res => res.json())
    );

    cacheService.set(cacheKey, countries, 10 * 60 * 1000); // 10 minutes
    return countries;
  },

  async getStates(countryCode: number) {
    const cacheKey = CACHE_KEYS.STATES(countryCode);
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      console.log('📦 Serving states from cache');
      return cached;
    }

    console.log('🌐 Fetching states from API');
    const states = await performanceService.measureApiCall(
      'getStates',
      fetch(`/api/states?countryCode=${countryCode}`).then(res => res.json())
    );

    cacheService.set(cacheKey, states, 10 * 60 * 1000);
    return states;
  },

  async getDistricts(stateId: number) {
    const cacheKey = CACHE_KEYS.DISTRICTS(stateId);
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      console.log('📦 Serving districts from cache');
      return cached;
    }

    console.log('🌐 Fetching districts from API');
    const districts = await performanceService.measureApiCall(
      'getDistricts',
      fetch(`/api/districts?stateId=${stateId}`).then(res => res.json())
    );

    cacheService.set(cacheKey, districts, 10 * 60 * 1000);
    return districts;
  },

  async getStdCode(countryCode: number) {
    const cacheKey = CACHE_KEYS.STD_CODE(countryCode);
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      console.log('📦 Serving STD code from cache');
      return cached;
    }

    console.log('🌐 Fetching STD code from API');
    const stdCode = await performanceService.measureApiCall(
      'getStdCode',
      fetch(`/api/stdcode?countryCode=${countryCode}`).then(res => res.json())
    );

    cacheService.set(cacheKey, stdCode, 30 * 60 * 1000); // 30 minutes
    return stdCode;
  },

  clearCache(): void {
    cacheService.clear();
    console.log('🧹 Cache cleared');
  },

  clearCountryCache(countryCode: number): void {
    cacheService.delete(CACHE_KEYS.STATES(countryCode));
    cacheService.delete(CACHE_KEYS.STD_CODE(countryCode));
    console.log(`🧹 Cache cleared for country ${countryCode}`);
  }
};