'use client'
import React, { useState } from 'react';
import countries from '/public/data/countries.json';



const CountrySelector = () => {
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleCountryChange = (e) => {
    const selectedCountryCode = e.target.value;
    const selectedCountryName = countries.find(
      (country) => country.code === selectedCountryCode
    ).name;
    setSelectedCountry(selectedCountryName);
    console.log(selectedCountryName);
  };

  return (
    <div>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Country</span>
        <select
        key='country-selector'
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
export  default CountrySelector;