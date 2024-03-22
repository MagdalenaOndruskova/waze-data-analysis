import React, { useContext, useEffect } from 'react';
import { dataContext, filterContext } from '../../utils/contexts';
import StatsTile from './StatsTile';
import * as Icons from '../../utils/icons';
import { useTranslation } from 'react-i18next';
import backendApi from '../../utils/api';
import { getXMinDate } from '../../utils/util';
import { get_data_delay_alerts, get_data_stats } from '../../utils/backendApiRequests';

type Props = {
  spaceBetween: boolean;
  isDashboard?: boolean;
};

const StatsTilesComplet = ({ spaceBetween, isDashboard }: Props) => {
  const { t } = useTranslation();
  const { filter } = useContext(filterContext);

  const {
    jamsData,
    alertData,
    levelData,
    speedData,
    lengthData,
    timeData,
    dateTimeFrom,
    dateTimeTo,
    setLengthData,
    setLevelData,
    setSpeedData,
    setTimeData,
    setDateTimeFrom,
    setDateTimeTo,
    setPreviousDate,
    setJamsData,
    setAlertData,
    setXAxisData,
  } = useContext(dataContext);

  useEffect(() => {
    console.log(filter);
    if (!filter) {
      return;
    }
    // TODO: optimalizacia -> nepytat data , problem je, ze sa data pytaju vo viacerych requestoch -> spojit do jedneho?

    const get_data = async () => {
      const response = await get_data_delay_alerts(filter);
      setJamsData(response.jams);
      setAlertData(response.alerts);
      setXAxisData(response.xaxis);
    };
    const get_data_stats_all = async () => {
      const response = await get_data_stats(filter);
      setSpeedData(response.speedKMH);
      setTimeData(response.time);
      setLevelData(response.level);
      setLengthData(response.length);
    };

    setDateTimeFrom(`${filter.fromDate}`);
    setDateTimeTo(`${filter.toDate}`);
    setPreviousDate(getXMinDate(filter?.toDate));

    get_data();
    get_data_stats_all();
  }, [filter]);

  return (
    <div className={isDashboard ? 'dashboard-top-row-stats' : ''}>
      <StatsTile
        icon={<Icons.WarningIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ').format(alertData?.reduce((sum, attribute) => sum + attribute, 0))}
        tileType={t('tile.ActiveAlerts')}
      ></StatsTile>
      {spaceBetween ? <br /> : <></>}
      <StatsTile
        icon={<Icons.CarIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ').format(jamsData?.reduce((sum, attribute) => sum + attribute, 0))}
        tileType={t('tile.TrafficJams')}
      ></StatsTile>
      {spaceBetween ? <br /> : <></>}
      <StatsTile
        icon={<Icons.SpeedIcon />}
        tileTitle={new Intl.NumberFormat('pt-PT', {
          style: 'unit',
          unit: 'kilometer-per-hour',
        }).format(Number((speedData?.reduce((sum, attribute) => sum + attribute, 0) / jamsData?.length).toFixed(2)))}
        tileType={t('tile.AverageSpeed')}
      ></StatsTile>
      {spaceBetween ? <br /> : <></>}
      <StatsTile
        icon={<Icons.CarIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ', {
          style: 'unit',
          unit: 'kilometer',
        }).format(lengthData?.reduce((sum, attribute) => sum + attribute, 0))}
        tileType={t('tile.JamsLength')}
      ></StatsTile>
      {spaceBetween ? <br /> : <></>}

      <StatsTile
        icon={<Icons.JamDelayIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ', {
          style: 'unit',
          unit: 'hour',
        }).format(timeData?.reduce((sum, attribute) => sum + attribute, 0) / 60)}
        tileType={t('tile.JamsDelay')}
      ></StatsTile>
      {spaceBetween ? <br /> : <></>}

      <StatsTile
        icon={<Icons.JamLevelIcon />}
        tileTitle={(levelData?.reduce((sum, attribute) => sum + attribute, 0) / jamsData?.length).toFixed(2)}
        tileType={t('tile.AverageJamLevel')}
      ></StatsTile>
    </div>
  );
};

export default StatsTilesComplet;
