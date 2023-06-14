import React from 'react';
import languageData from '/public/data/languages.json';

const LanguageList = ({ languages }) => {
  const languageNames = languages.map((code) => {
    const language = languageData.find((item) => item.code === code.toLowerCase());
    return language ? language.name : code;
  });

  return <>{languageNames.join(', ')}</>;
};

export default LanguageList;