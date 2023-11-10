import React from 'react';
import { Select } from 'antd';

const LanguageSwitcher = ({ i18n, t }) => {
  const languageOptions = [
    { value: 'sk', label: t('language.Slovak'), flag: '/slovakia.png' },
    { value: 'en', label: t('language.English'), flag: '/united-kingdom.png' },
    { value: 'cs', label: t('language.Czech'), flag: '/czech-republic.png' },
  ];

  const onClickLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select style={{ minWidth: 120 }} onChange={onClickLanguageChange} defaultValue="sk">
      {languageOptions.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          <img src={option.flag} alt={option.value} style={{ marginRight: 8, width: 24, height: 16 }} />
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default LanguageSwitcher;
