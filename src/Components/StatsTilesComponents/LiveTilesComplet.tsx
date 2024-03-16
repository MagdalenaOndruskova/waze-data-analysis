import React, { useContext } from 'react';
import { dataContext } from '../../utils/contexts';
import LiveTile from './LiveTile';
import * as Icons from '../../utils/icons';
import { useTranslation } from 'react-i18next';

type Props = {
  spaceBetween: boolean;
};

const LiveTilesComplet = ({ spaceBetween }: Props) => {
  const { t } = useTranslation();

  const { jamsData, alertData, levelData, speedData, lengthData, timeData } = useContext(dataContext);

  return (
    <>
      <LiveTile
        icon={<Icons.WarningIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ').format(alertData?.reduce((sum, attribute) => sum + attribute, 0))}
        tileType={t('tile.ActiveAlerts')}
      ></LiveTile>
      {spaceBetween ? <br /> : <></>}
      <LiveTile
        icon={<Icons.CarIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ').format(jamsData?.reduce((sum, attribute) => sum + attribute, 0))}
        tileType={t('tile.TrafficJams')}
      ></LiveTile>
      {spaceBetween ? <br /> : <></>}
      <LiveTile
        icon={<Icons.SpeedIcon />}
        tileTitle={new Intl.NumberFormat('pt-PT', {
          style: 'unit',
          unit: 'kilometer-per-hour',
        }).format(Number((speedData?.reduce((sum, attribute) => sum + attribute, 0) / jamsData?.length).toFixed(2)))}
        tileType={t('tile.AverageSpeed')}
      ></LiveTile>
      {spaceBetween ? <br /> : <></>}
      <LiveTile
        icon={<Icons.CarIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ', {
          style: 'unit',
          unit: 'kilometer',
        }).format(lengthData?.reduce((sum, attribute) => sum + attribute, 0))}
        tileType={t('tile.JamsLength')}
      ></LiveTile>
      {spaceBetween ? <br /> : <></>}

      <LiveTile
        icon={<Icons.JamDelayIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ', {
          style: 'unit',
          unit: 'hour',
        }).format(timeData?.reduce((sum, attribute) => sum + attribute, 0) / 60)}
        tileType={t('tile.JamsDelay')}
      ></LiveTile>
      {spaceBetween ? <br /> : <></>}

      <LiveTile
        icon={<Icons.JamLevelIcon />}
        tileTitle={(levelData?.reduce((sum, attribute) => sum + attribute, 0) / jamsData?.length).toFixed(2)}
        tileType={t('tile.AverageJamLevel')}
      ></LiveTile>
    </>
  );
};

export default LiveTilesComplet;
