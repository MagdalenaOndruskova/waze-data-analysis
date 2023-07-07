import React, { createContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/layout-styles.scss';
import { useFilter } from '../utils/useFilter';
import { filterContext } from '../utils/contexts';

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
  height: '70px',
  // position: 'fixed',
  width: '100%',
  paddingBottom: '100% auto',
  bottom: 0,
  left: 0,
};

const MainLayout = () => {
  const filter = useFilter();

  return (
    <Layout>
      <filterContext.Provider value={filter}>
        <Navbar />
        <Layout>
          <Sidebar />
          <Content className="content">
            <Outlet />
          </Content>
        </Layout>
        {/* <Footer style={footerStyle}>Footer</Footer> */}
      </filterContext.Provider>
    </Layout>
  );
};

export default MainLayout;
