import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from './layout/MainLayout';
import './i18n/i18n';

import './App.css';
import './styles/layout-styles.scss';
import './styles/responsivity.scss';
import Dashboard from './pages/Dashboard';
import FullMap from './pages/FullMap';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/waze-data-analysis/" element={<Layout />}>
        <Route index element={<FullMap />} />
        <Route path="/waze-data-analysis/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
