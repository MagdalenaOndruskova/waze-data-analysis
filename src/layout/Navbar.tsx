import React, { useContext, useRef } from 'react';
import Brno from '../assets/Brno.png';
import { NavLink, useSearchParams } from 'react-router-dom';
import '../styles/layout-styles.scss';
import { FILTER_DEFAULT_VALUE, filterContext } from '../utils/contexts';

function Navbar() {
  const [searchParams] = useSearchParams();

  const { filter } = useContext(filterContext);

  var searchParamsQuery = '';
  if (JSON.stringify(filter) !== JSON.stringify(FILTER_DEFAULT_VALUE.filterDefaultValue) && filter !== null) {
    searchParamsQuery = `?${searchParams.toString()}`;
  }

  return (
    <header>
      <img src={Brno} alt="Brno" />
      <nav id="header">
        <NavLink to={`/waze-data-analysis/${searchParamsQuery}`}>Live Map</NavLink>
        <NavLink to={`dashboard${searchParamsQuery}`}>Dashboard</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
