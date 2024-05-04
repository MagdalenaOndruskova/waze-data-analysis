import React, { useContext } from 'react';
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

  const { filter, setNewFilter } = useContext(filterContext);

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
      <div
        style={{ height: '55px', width: '120px', cursor: 'pointer' }}
        onClick={() => {
          setNewFilter(FILTER_DEFAULT_VALUE.filterDefaultValue);
          navigate('/waze-data-analysis/');
        }}
        className="logo"
      >
        <svg
          xmlns="https://www.w3.org/2000/svg"
          fillRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="2"
          clipRule="evenodd"
          viewBox="0 0 196 44"
        >
          <g id="logo" fill="#da2128" fillRule="nonzero">
            <path d="M57.8 40.8h-.2c-.3 1-.8 1.7-1.6 2.3-.8.5-1.8.8-2.8.8-2 0-3.7-.7-4.7-2.2-1.1-1.5-1.7-3.6-1.7-6.3 0-2.7.6-4.8 1.7-6.2 1-1.5 2.6-2.2 4.7-2.2 1 0 2 .3 2.8.8a4 4 0 011.6 2.2h.2v-9.4h4v23h-4v-2.8zM188.2 44c-1 0-2-.2-3-.6-.8-.4-1.6-1-2.2-1.7a8 8 0 01-1.5-2.6c-.3-1-.5-2.2-.5-3.5 0-1.2.2-2.4.5-3.4.4-1 .8-2 1.5-2.6.6-.8 1.4-1.3 2.2-1.7 1-.4 2-.6 3-.6s2 .2 3 .6c.8.4 1.6 1 2.2 1.7.6.7 1.1 1.6 1.5 2.6.3 1 .5 2.2.5 3.4 0 1.3-.2 2.5-.5 3.5-.4 1-.9 1.9-1.5 2.6a6.5 6.5 0 01-5.2 2.3zm-108.4-.4c-1 0-1.6-.2-2.1-.7-.5-.5-.8-1.2-1-2h-.1c-.3 1-.8 1.8-1.7 2.3-.8.5-1.8.8-3 .8-1.7 0-3-.4-3.8-1.3-1-.9-1.4-2-1.4-3.5 0-1.6.6-2.9 1.8-3.7a9 9 0 015.1-1.2h2.8V33c0-1-.3-1.6-.7-2.1-.5-.5-1.3-.7-2.3-.7-1 0-1.7.2-2.3.6a6 6 0 00-1.4 1.4l-2.4-2.1c.6-1 1.4-1.7 2.4-2.3 1-.5 2.3-.8 4-.8 2.1 0 3.8.5 5 1.5 1 1 1.6 2.4 1.6 4.3v7.6H82v3.1h-2.2zm31.8 0c-.8 0-1.5-.2-2-.7-.5-.5-.8-1.2-1-2h-.2c-.2 1-.8 1.8-1.6 2.3-.8.5-1.8.8-3 .8-1.7 0-3-.4-3.9-1.3-.9-.9-1.3-2-1.3-3.5 0-1.6.6-2.9 1.8-3.7a9 9 0 015.1-1.2h2.8V33c0-1-.3-1.6-.8-2.1-.4-.5-1.2-.7-2.2-.7-1 0-1.7.2-2.3.6a6 6 0 00-1.4 1.4l-2.4-2.1c.6-1 1.4-1.7 2.4-2.3 1-.5 2.3-.8 4-.8 2.1 0 3.8.5 5 1.5 1 1 1.6 2.4 1.6 4.3v7.6h1.6v3.1h-2.2zm38.5 0v-16h2.5v3h.1c.3-.8.8-1.5 1.6-2 .7-.7 1.7-1 3-1h1V30h-1.5c-1.3 0-2.3.3-3.1.8-.8.5-1.1 1.1-1.1 1.9v10.8H150zm13 0v-16h2.4v2.7h.1c.4-1 1-1.7 1.7-2.2.7-.6 1.6-.8 2.8-.8a5 5 0 014 1.6c1 1 1.4 2.5 1.4 4.5v10.2H173v-9.8c0-2.9-1.2-4.3-3.6-4.3-.5 0-1 0-1.5.2l-1.2.6c-.4.2-.7.5-.9.9-.2.4-.3.8-.3 1.3v11.1H163zm-71.4 0c-1.4 0-2.4-.3-3.2-1-.7-.7-1-1.8-1-3v-9H85v-3.1h1.2c.6 0 1-.2 1.3-.5.2-.2.3-.7.3-1.2v-5h3.5v6.7h3.4v3.1h-3.4v9.9h3.1v3.1h-2.8zm32-5h-5v5h5v-5zm4.9-17.9h8.9c1.7 0 3.2.5 4.2 1.6a6 6 0 011.5 4.3 6 6 0 01-.3 2.2c-.3.6-.5 1-.9 1.4-.3.4-.7.7-1.1.9l-1.2.4v.2a4.2 4.2 0 012.7 1.2 5.9 5.9 0 011.5 4 8 8 0 01-.4 2.7 5.4 5.4 0 01-3 3.5 5 5 0 01-2.1.5h-9.8V20.6zm59.6 21.1c1.3 0 2.4-.4 3.3-1.2.8-.9 1.2-2.1 1.2-3.8v-2.3c0-1.7-.4-3-1.2-3.8-.9-.8-2-1.2-3.3-1.2-1.3 0-2.4.4-3.3 1.2-.8.8-1.3 2.1-1.3 3.8v2.3c0 1.7.5 3 1.3 3.8.9.8 2 1.2 3.3 1.2zm-57-.6h6.4c1 0 2-.3 2.6-.9.6-.6 1-1.5 1-2.6v-1.2c0-1.1-.4-2-1-2.6-.6-.6-1.5-1-2.6-1h-6.4v8.3zm-58 0c.9 0 1.6-.3 2.3-.7.6-.4.9-1 .9-1.7v-2.1h-2.6c-2 0-3 .6-3 2v.5c0 .6.2 1.1.6 1.4.4.4 1 .5 1.8.5zm31.9 0c.9 0 1.6-.3 2.2-.7.7-.4 1-1 1-1.7v-2.1h-2.6c-2 0-3 .6-3 2v.5c0 .6.1 1.1.6 1.4.4.4 1 .5 1.8.5zm-50.7-.5a4 4 0 002.4-.7c.6-.4 1-1 1-2v-5c0-.8-.4-1.5-1-2-.6-.4-1.4-.7-2.4-.7s-1.8.4-2.5 1a4 4 0 00-1 2.9v2.7c0 1.2.4 2.1 1 2.8.7.7 1.5 1 2.5 1zm76.8-10h6c1 0 1.8-.3 2.4-.9.5-.5.8-1.3.8-2.4v-1c0-1.1-.3-1.9-.8-2.4-.6-.6-1.4-.9-2.5-.9h-6v7.5z"></path>
            <rect id="box-s" x="-0" y="21.953" width="8.783" height="21.953"></rect>
            <rect id="box-l" x="17.567" y="0" width="14.633" height="43.905"></rect>
          </g>
        </svg>
      </div>
      <p className="title">{t('app.title')}</p>
      <nav className="header-nav">
        <NavLink to={`/waze-data-analysis/${searchParamsQuery}`} className={'navLink'} end>
          {t('Live Map')}
        </NavLink>
        <NavLink to={`dashboard${searchParamsQuery}`} className={'navLink'} end>
          {t('Dashboard')}
        </NavLink>
        <LanguageSwitcher i18n={i18n} t={t}></LanguageSwitcher>
        <Dropdown
          menu={{ items, selectable: true, defaultSelectedKeys: ['0'] }}
          trigger={['click']}
          className="mobile-menu"
          overlayClassName="mobile-menu-overlay"
        >
          <a onClick={(e) => e.preventDefault()}>
            <MenuOutlined />
          </a>
        </Dropdown>
      </nav>
    </header>
  );
}

export default Navbar;
