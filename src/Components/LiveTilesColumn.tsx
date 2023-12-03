import React from 'react';
import LiveTile from './LiveTile';
import * as Icons from '../utils/icons';
import { useTranslation } from 'react-i18next';

const LiveTilesColumn = ({ dataEvent, dataDelay }) => {
  const { t } = useTranslation();
  return (
    <div>
      <LiveTile
        icon={<Icons.WarningIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ').format(dataEvent?.features?.length)}
        tileType={t('tile.ActiveAlerts')}
      ></LiveTile>
      <LiveTile
        icon={<Icons.CarIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ').format(dataDelay?.features?.length)}
        tileType={t('tile.TrafficJams')}
      ></LiveTile>
      <LiveTile
        icon={<Icons.SpeedIcon />}
        tileTitle={new Intl.NumberFormat('pt-PT', {
          style: 'unit',
          unit: 'kilometer-per-hour',
        }).format(
          Number(
            (
              dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.speedKMH, 0) /
              dataDelay?.features?.length
            ).toFixed(2),
          ),
        )}
        tileType={t('tile.AverageSpeed')}
      ></LiveTile>
      <LiveTile
        icon={<Icons.CarIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ', {
          style: 'unit',
          unit: 'kilometer',
        }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.length, 0) / 1000)}
        tileType={t('tile.JamsLength')}
      ></LiveTile>
      <LiveTile
        icon={<Icons.JamDelayIcon />}
        tileTitle={new Intl.NumberFormat('cs-CZ', {
          style: 'unit',
          unit: 'hour',
        }).format(dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.delay, 0) / 3600)}
        tileType={t('tile.JamsDelay')}
      ></LiveTile>
      <LiveTile
        icon={<Icons.JamLevelIcon />}
        tileTitle={(
          dataDelay?.features?.reduce((sum, { attributes }) => sum + attributes.level, 0) / dataDelay?.features?.length
        ).toFixed(2)}
        tileType={t('tile.AverageJamLevel')}
      ></LiveTile>
    </div>
  );
};

export default LiveTilesColumn;
