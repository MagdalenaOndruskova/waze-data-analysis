import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Navbar from './Navbar';
// import '../styles/layout-styles.scss';
import { useFilter } from '../utils/useFilter';
import { filterContext, streetContext, dataContext } from '../utils/contexts';
import { useStreetContext } from '../utils/useStreetContext';
import { useDataContext } from '../utils/useDataContext';

const MainLayout = () => {
  const filter = useFilter();
  const street = useStreetContext();
  const data = useDataContext();

  return (
    <Layout>
      <filterContext.Provider value={filter}>
        <streetContext.Provider value={street}>
          <dataContext.Provider value={data}>
            <Navbar />
            <Layout>
              <Content className="content">
                <Outlet />
              </Content>
            </Layout>
          </dataContext.Provider>
        </streetContext.Provider>
      </filterContext.Provider>
    </Layout>
  );
};

export default MainLayout;
