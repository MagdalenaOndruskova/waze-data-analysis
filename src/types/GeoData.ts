import { RoadTypeEnum } from './RoadTypeEnum';

export type GeoData = {
  city: string;
  country: 'CZ' | 'EZ';
  street: string;
  roadType: RoadTypeEnum;
  latitude?: number;
  longitude?: number;
  pubMillis: number; // TODO: date?
};
