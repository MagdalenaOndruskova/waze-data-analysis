import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LiveDashboardPage from './pages/LiveDashboardPage';
import Layout from './layout/MainLayout';
import './i18n/i18n';

import './App.css';
import Dashboard from './pages/Dashboard';
import FullMap from './pages/FullMap';

function App() {
  return (
    <Routes>
      <Route path="/waze-data-analysis/" element={<Layout />}>
        <Route index element={<LiveDashboardPage />} />
        <Route path="/waze-data-analysis/dashboard" element={<Dashboard />} />
        <Route path="/waze-data-analysis/test" element={<FullMap />} />
      </Route>
      <Route path="*" element={<h1>TODO: NotFound komponent!</h1>} />
    </Routes>
  );
}

export default App;
