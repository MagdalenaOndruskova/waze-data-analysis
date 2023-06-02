import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LiveDashboardPage from './pages/LiveDashboardPage';
import Layout from './layout/MainLayout';

import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LiveDashboardPage />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<h1>TODO: NotFound komponent</h1>} />
    </Routes>
  );
}

export default App;
