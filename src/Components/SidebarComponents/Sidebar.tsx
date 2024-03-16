import { BarChartOutlined, InfoCircleOutlined, LineChartOutlined, MailOutlined, MenuOutlined } from '@ant-design/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  setOpenDrawer: (value: React.SetStateAction<boolean>) => void;
  setOpenDrawerPlot: (value: React.SetStateAction<boolean>) => void;
  setOpenInfoModalState: (value: React.SetStateAction<boolean>) => void;
  setOpenEmailModal: (value: React.SetStateAction<boolean>) => void;

  refStats: React.MutableRefObject<any>;
  refLineStats: React.MutableRefObject<any>;
  refContacForm: React.MutableRefObject<any>;
};

const Sidebar = ({
  setOpenDrawer,
  setOpenDrawerPlot,
  setOpenInfoModalState,
  setOpenEmailModal,

  refStats,
  refContacForm,
  refLineStats,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      <div
        onClick={() => {
          setOpenDrawer(true);
        }}
        style={{ paddingBottom: 10 }}
        ref={refStats}
      >
        <BarChartOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />

        <p>{t('graph.tiles.title')}</p>
      </div>

      <div
        onClick={() => {
          setOpenDrawerPlot(true);
        }}
        style={{ paddingBottom: 10 }}
        ref={refLineStats}
      >
        <LineChartOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />

        <p>{t('graph.priebeh')}</p>
      </div>

      <div
        onClick={() => {
          setOpenInfoModalState(true);
        }}
        style={{
          paddingBottom: 10,
          position: 'absolute',
          bottom: '3%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <InfoCircleOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />
        <p>Info</p>
      </div>
      <div
        onClick={() => {
          setOpenEmailModal(true);
        }}
        style={{
          paddingBottom: 10,
          position: 'absolute',
          bottom: '-2%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        ref={refContacForm}
      >
        <MailOutlined className="iconStyle" style={{ fontSize: 20, paddingTop: 10 }} />
        <p>{t('contact')}</p>
      </div>
    </div>
  );
};

export default Sidebar;
