import React from 'react';
import data from '/public/data/countries.json';

const Country = ({countryName, flagClass}) => {

  const country = data.find((item) => item.code === countryName);
  return (
    <span>
      {country.name}
      <img className={flagClass} src={country.image} alt={country.name} />
    </span>
  );
};

export default Country;
