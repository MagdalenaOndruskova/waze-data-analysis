import { GeoLocation } from './GeoLocation';

type LatLngPair = [number, number];
type NestedLatLngArray = LatLngPair[];

export type StreetFull = {
  location: any | NestedLatLngArray[]; //GeoLocation[] | NestedLatLngArray[] | [] | null;
  name: string;
  code: number;
};
