import { Tour, TourProps } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  refStats: React.MutableRefObject<any>;
  refLineStats: React.MutableRefObject<any>;
  refContacForm: React.MutableRefObject<any>;
  refRoute: React.MutableRefObject<any>;
  refRouteSidebar: React.MutableRefObject<any>;
  refDelays: React.MutableRefObject<any>;
  refAlerts: React.MutableRefObject<any>;

  openTour: boolean;
  setOpenTour: React.Dispatch<React.SetStateAction<boolean>>;
};

const ApplicationTour = ({
  refStats,
  refContacForm,
  refLineStats,
  refRoute,
  refRouteSidebar,
  refDelays,
  refAlerts,
  openTour,
  setOpenTour,
}: Props) => {
  const { t } = useTranslation();

  const steps: TourProps['steps'] = [
    {
      title: t('sidebar.route'),
      description: t('tour.stats.explained'),
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      target: () => refRouteSidebar.current,
    },
    {
      title: t('graph.tiles.title'),
      description: t('tour.stats.explained'),
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },
      target: () => refStats.current,
    },
    {
      title: t('graph.priebeh'),
      description: t('tour.priebeh.explained'),
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },
      target: () => refLineStats.current,
    },
    {
      title: t('contact'),
      description: t('tour.contact.explained'),
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },
      target: () => refContacForm.current,
    },
    {
      title: t('route.button'),
      description: t('tour.route.explained'),
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },

      target: () => refRoute.current,
    },
    {
      title: t('Jams'),
      description: t('tour.jams.explained'),
      nextButtonProps: { children: <p>{t('tour.next')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },
      target: () => refDelays.current,
    },
    {
      title: t('Alerts'),
      description: t('tour.alerts.explained'),
      nextButtonProps: { children: <p>{t('tour.final')}</p>, className: 'modalButton' },
      prevButtonProps: { children: <p>{t('tour.previous')}</p> },
      target: () => refAlerts.current,
    },
  ];
  return <Tour open={openTour} onClose={() => setOpenTour(false)} steps={steps} />;
};

export default ApplicationTour;
