import React, { useContext } from 'react';
import Brno from '../assets/Brno.png';
import { useNavigate, NavLink, useSearchParams } from 'react-router-dom';
import '../styles/layout-styles.scss';
import { FILTER_DEFAULT_VALUE, filterContext } from '../utils/contexts';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../Components/LanguageSwitcher';

function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [searchParams] = useSearchParams();

  const { filter } = useContext(filterContext);

  var searchParamsQuery = '';
  if (JSON.stringify(filter) !== JSON.stringify(FILTER_DEFAULT_VALUE.filterDefaultValue) && filter !== null) {
    searchParamsQuery = `?${searchParams.toString()}`;
  }

  return (
    <header className="header">
      <img src={Brno} alt="Brno" onClick={() => navigate('/waze-data-analysis/')} />
      <p className="title">{t('app.title')}</p>
      <nav>
        <LanguageSwitcher i18n={i18n} t={t}></LanguageSwitcher>
        <NavLink to={`/waze-data-analysis/${searchParamsQuery}`}>{t('Live Map')}</NavLink>
        <NavLink to={`dashboard${searchParamsQuery}`}>{t('Dashboard')}</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
