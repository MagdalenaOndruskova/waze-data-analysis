import React, { createContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import Navbar from './Navbar';
import '../styles/layout-styles.scss';
import { useFilter } from '../utils/useFilter';
import { filterContext, streetContext } from '../utils/contexts';
import { useStreetContext } from '../utils/useStreetContext';

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
  const street = useStreetContext();

  return (
    <Layout>
      <filterContext.Provider value={filter}>
        <streetContext.Provider value={street}>
          <Navbar />
          <Layout>
            <Content className="content">
              <Outlet />
            </Content>
          </Layout>
          {/* <Footer style={footerStyle}>Footer</Footer> */}
        </streetContext.Provider>
      </filterContext.Provider>
    </Layout>
  );
};

export default MainLayout;
