import { Polyline } from 'leaflet';
import { number } from 'prop-types';

export type StreetInMap = {
  name: string;
  lines: Polyline[];
};
