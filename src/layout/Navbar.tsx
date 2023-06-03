import React, { useRef } from 'react';
import Brno from '../assets/Brno.png';
import { NavLink } from 'react-router-dom';
import '../styles/layout-styles.scss';

function Navbar() {
  const navRef = useRef();

  return (
    <header>
      <img src={Brno} alt="Brno" />
      <nav id="header">
        <NavLink to="/waze-data-analysis/">Live Map</NavLink>
        <NavLink to="dashboard">Dashboard</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
