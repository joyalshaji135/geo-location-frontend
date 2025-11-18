import React, { useState, useEffect, useRef } from 'react';
import { useLocationData } from '../hooks/useLocationData';
import { validateEnvVariables } from '../services/apiService';
import './LocationPhoneForm.css';

const LocationPhoneForm: React.FC = () => {
  // Validate environment variables on component mount
  useEffect(() => {
    validateEnvVariables();
  }, []);

  const {
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
    resetForm
  } = useLocationData();

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const formData = {
      country: selectedCountry,
      state: selectedState,
      district: selectedDistrict,
      phoneNumber: countryStdCode ? `+${countryStdCode.stdcode} ${phoneNumber}` : phoneNumber,
      countryName: countries.find(c => c.countrycode === selectedCountry)?.countryname,
      stateName: states.find(s => s.stateID === selectedState)?.stateName,
      districtName: districts.find(d => d.cityID === selectedDistrict)?.cityName,
    };

    console.log('Form Data:', formData);
    
    // Show success animation
    setShowSuccess(true);
    setIsSubmitting(false);
    
    // Reset success state after animation
    setTimeout(() => {
      setShowSuccess(false);
      alert(`Form submitted successfully!\n\nCountry: ${formData.countryName}\nState: ${formData.stateName}\nDistrict: ${formData.districtName}\nPhone: ${formData.phoneNumber}`);
    }, 2000);
  };

  const handleReset = () => {
    // Add reset animation
    if (formRef.current) {
      formRef.current.classList.add('resetting');
      setTimeout(() => {
        resetForm();
        setPhoneNumber('');
        formRef.current?.classList.remove('resetting');
      }, 300);
    }
  };

  return (
    <div className="location-phone-form">
      <div className={`form-container ${showSuccess ? 'success' : ''}`}>
        <div className="form-header">
          <h1 className="form-title">Location & Phone Details</h1>
          <p className="form-subtitle">Please fill in your location information and phone number</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="animated-form">
          <div className="form-grid">
            {/* Country Dropdown */}
            <div className="form-group">
              <label htmlFor="country" className="form-label">
                Country *
              </label>
              <div className="select-wrapper">
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value ? Number(e.target.value) : '')}
                  required
                  disabled={loading.countries}
                  className="form-select"
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.countrycode} value={country.countrycode}>
                      {country.countryname}
                    </option>
                  ))}
                </select>
                <div className="select-arrow"></div>
              </div>
              {loading.countries && (
                <div className="loading-indicator">
                  <div className="loading-spinner"></div>
                  <span>Loading countries...</span>
                </div>
              )}
              {errors.countries && <div className="error-message">{errors.countries}</div>}
            </div>

            {/* State Dropdown */}
            <div className="form-group">
              <label htmlFor="state" className="form-label">
                State *
              </label>
              <div className="select-wrapper">
                <select
                  id="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value ? Number(e.target.value) : '')}
                  required
                  disabled={!selectedCountry || loading.states}
                  className="form-select"
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state.stateID} value={state.stateID}>
                      {state.stateName}
                    </option>
                  ))}
                </select>
                <div className="select-arrow"></div>
              </div>
              {loading.states && (
                <div className="loading-indicator">
                  <div className="loading-spinner"></div>
                  <span>Loading states...</span>
                </div>
              )}
              {errors.states && <div className="error-message">{errors.states}</div>}
            </div>

            {/* District Dropdown */}
            <div className="form-group">
              <label htmlFor="district" className="form-label">
                District *
              </label>
              <div className="select-wrapper">
                <select
                  id="district"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value ? Number(e.target.value) : '')}
                  required
                  disabled={!selectedState || loading.districts}
                  className="form-select"
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district.cityID} value={district.cityID}>
                      {district.cityName}
                    </option>
                  ))}
                </select>
                <div className="select-arrow"></div>
              </div>
              {loading.districts && (
                <div className="loading-indicator">
                  <div className="loading-spinner"></div>
                  <span>Loading districts...</span>
                </div>
              )}
              {errors.districts && <div className="error-message">{errors.districts}</div>}
            </div>

            {/* Phone Number Input */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number *
              </label>
              <div className="phone-input-container">
                <div className="country-code-display">
                  {loading.stdCode ? (
                    <div className="loading-indicator">
                      <div className="loading-spinner small"></div>
                    </div>
                  ) : countryStdCode ? (
                    <div className="country-code-content">
                      {countryStdCode.countryLogo && (
                        <img 
                          src={countryStdCode.countryLogo} 
                          alt={countryStdCode.countryname}
                          className="country-flag"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <span className="std-code">+{countryStdCode.stdcode}</span>
                    </div>
                  ) : (
                    <span className="placeholder">Select country</span>
                  )}
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter phone number"
                  required
                  disabled={!selectedCountry}
                  maxLength={15}
                  className="phone-input"
                />
              </div>
              {errors.stdCode && <div className="error-message">{errors.stdCode}</div>}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn reset-btn"
              onClick={handleReset}
              disabled={loading.countries || loading.states || loading.districts || loading.stdCode}
            >
              <span className="btn-text">Reset</span>
            </button>
            <button 
              type="submit" 
              className="btn submit-btn"
              disabled={!selectedCountry || !selectedState || !selectedDistrict || !phoneNumber || isSubmitting}
            >
              {isSubmitting ? (
                <div className="btn-loading">
                  <div className="btn-spinner"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <span className="btn-text">Submit</span>
              )}
            </button>
          </div>
        </form>

        {/* Success Animation */}
        {showSuccess && (
          <div className="success-animation">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
            <div className="success-message">Submitted Successfully!</div>
          </div>
        )}

        {/* Display selected values for debugging */}
        <div className="debug-info">
          <details>
            <summary className="debug-toggle">Debug Information</summary>
            <div className="debug-content">
              <h3>Selected Values:</h3>
              <p>Country: {selectedCountry} - {countries.find(c => c.countrycode === selectedCountry)?.countryname}</p>
              <p>State: {selectedState} - {states.find(s => s.stateID === selectedState)?.stateName}</p>
              <p>District: {selectedDistrict} - {districts.find(d => d.cityID === selectedDistrict)?.cityName}</p>
              <p>Phone: {countryStdCode ? `+${countryStdCode.stdcode} ${phoneNumber}` : phoneNumber}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default LocationPhoneForm;