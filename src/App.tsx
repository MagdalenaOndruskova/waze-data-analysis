import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from './layout/MainLayout';
import './i18n/i18n';

import './App.css';
import Dashboard from './pages/Dashboard';
import FullMap from './pages/FullMap';

function App() {
  return (
    <Routes>
      <Route path="/waze-data-analysis/" element={<Layout />}>
        <Route index element={<FullMap />} />
        <Route path="/waze-data-analysis/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<h1>TODO: NotFound komponent!</h1>} />
    </Routes>
  );
}

export default App;
