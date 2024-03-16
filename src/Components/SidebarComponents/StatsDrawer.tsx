import { Drawer } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import LiveTilesComplet from '../StatsTilesComponents/StatsTileComplet';

type Props = {
  open: boolean;
  onCloseDrawer: any;
};

const StatsDrawer = ({ open, onCloseDrawer }: Props) => {
  const { t } = useTranslation();

  return (
    <Drawer
      className="sidebar-drawer"
      title={t('graph.tiles.title')}
      placement="left"
      onClose={onCloseDrawer}
      open={open}
      width={'250px'}
      closable={true}
      zIndex={10000}
    >
      <LiveTilesComplet spaceBetween={true} />
    </Drawer>
  );
};

export default StatsDrawer;
