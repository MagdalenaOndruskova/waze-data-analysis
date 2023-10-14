import React, { useContext, useRef } from 'react';
import Brno from '../assets/Brno.png';
import { useNavigate, NavLink, useSearchParams } from 'react-router-dom';
import '../styles/layout-styles.scss';
import { FILTER_DEFAULT_VALUE, filterContext } from '../utils/contexts';
import { useTranslation } from 'react-i18next';

const languages = [
  { name: 'English', code: 'en' },
  { name: 'Čeština', code: 'cs' },
  { name: 'Slovenčina', code: 'sk' },
];

function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [searchParams] = useSearchParams();

  const { filter } = useContext(filterContext);

  var searchParamsQuery = '';
  if (JSON.stringify(filter) !== JSON.stringify(FILTER_DEFAULT_VALUE.filterDefaultValue) && filter !== null) {
    searchParamsQuery = `?${searchParams.toString()}`;
  }

  const onClickLanguageChange = (e: any) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  return (
    <header>
      <img src={Brno} alt="Brno" onClick={() => navigate('/waze-data-analysis/')} />
      <p className="title">{t('app.title')}</p>
      <nav id="header">
        <select style={{ width: 100 }} onChange={onClickLanguageChange}>
          <option value="sk">{t('language.Slovak')}</option>
          <option value="en">{t('language.English')}</option>
          <option value="cs">{t('language.Czech')}</option>
        </select>
        <NavLink to={`/waze-data-analysis/${searchParamsQuery}`}>{t('Live Map')}</NavLink>
        <NavLink to={`dashboard${searchParamsQuery}`}>{t('Dashboard')}</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
