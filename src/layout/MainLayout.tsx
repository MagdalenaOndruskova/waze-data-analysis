import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Navbar from './Navbar';
import { useFilter } from '../utils/useFilter';
import { filterContext, streetContext, dataContext, routeContext } from '../utils/contexts';
import { useStreetContext } from '../utils/useStreetContext';
import { useDataContext } from '../utils/useDataContext';
import { useRouteContext } from '../utils/useRouteContext';

const MainLayout = () => {
  const filter = useFilter();
  const street = useStreetContext();
  const data = useDataContext();
  const route = useRouteContext();

  return (
    <Layout>
      <filterContext.Provider value={filter}>
        <streetContext.Provider value={street}>
          <dataContext.Provider value={data}>
            <routeContext.Provider value={route}>
              <Navbar />
              <Layout>
                <Content className="content">
                  <Outlet />
                </Content>
              </Layout>
            </routeContext.Provider>
          </dataContext.Provider>
        </streetContext.Provider>
      </filterContext.Provider>
    </Layout>
  );
};

export default MainLayout;
