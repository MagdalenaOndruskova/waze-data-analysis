import React, { useContext } from 'react';
import Brno from '../assets/Brno.png';
import { useNavigate, NavLink, useSearchParams } from 'react-router-dom';
// import '../styles/layout-styles.scss';
import { FILTER_DEFAULT_VALUE, filterContext } from '../utils/contexts';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../Components/LanguageSwitcher';
import { Dropdown, MenuProps } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [searchParams] = useSearchParams();

  const { filter } = useContext(filterContext);

  var searchParamsQuery = '';
  if (JSON.stringify(filter) !== JSON.stringify(FILTER_DEFAULT_VALUE.filterDefaultValue) && filter !== null) {
    searchParamsQuery = `?${searchParams.toString()}`;
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <NavLink to={`/waze-data-analysis/${searchParamsQuery}`} className={'navLink'} end>
          {t('Live Map')}
        </NavLink>
      ),
      key: '0',
    },
    {
      label: (
        <NavLink to={`dashboard${searchParamsQuery}`} className={'navLink'} end>
          {t('Dashboard')}
        </NavLink>
      ),
      key: '1',
    },
    {
      type: 'divider',
    },
    // {
    //   label: <LanguageSwitcher i18n={i18n} t={t}></LanguageSwitcher>,
    //   key: '3',
    // },
  ];

  return (
    <header className="header">
      <img src={Brno} alt="Brno" onClick={() => navigate('/waze-data-analysis/')} />
      <p className="title">{t('app.title')}</p>
      <nav className="header-nav">
        <NavLink to={`/waze-data-analysis/${searchParamsQuery}`} className={'navLink'} end>
          {t('Live Map')}
        </NavLink>
        <NavLink to={`dashboard${searchParamsQuery}`} className={'navLink'} end>
          {t('Dashboard')}
        </NavLink>
        <LanguageSwitcher i18n={i18n} t={t}></LanguageSwitcher>
      </nav>

      <Dropdown
        menu={{ items, selectable: true, defaultSelectedKeys: ['0'] }}
        trigger={['click']}
        className="mobile-menu"
      >
        <a onClick={(e) => e.preventDefault()}>
          <MenuOutlined />
        </a>
      </Dropdown>
    </header>
  );
}

export default Navbar;
