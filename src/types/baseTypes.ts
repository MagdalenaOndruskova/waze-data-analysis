import { Street } from './Street';

export type Streets = {
  features: {
    attributes: Street;
    geometry: {
      paths: [];
    };
  }[];
};

export type AdressPoint = Array<{
  latitude: number;
  longitude: number;
  type: string;
  subtype: string;
  street: string;
  pubMillis: any;
  key: string;
  visible?: boolean;
}>;

export type Coord = {
  latitude: number;
  longitude: number;
  marker: L.Marker<any>;
  street: string;
};
