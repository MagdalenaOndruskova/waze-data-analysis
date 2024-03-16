import { Street } from './Street';

export type Streets = {
  features: {
    attributes: Street;
    geometry: {
      paths: [];
    };
  }[];
};
