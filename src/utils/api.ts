import axios from 'axios';

export const jamApi = axios.create({
  baseURL: `https://gis.brno.cz/ags1/rest/services/Hosted/WazeJams/FeatureServer`,
});

export const eventApi = axios.create({
  baseURL: `https://gis.brno.cz/ags1/rest/services/Hosted/WazeAlerts/FeatureServer`,
});

export const streetApi = axios.create({
  baseURL:
    'https://services6.arcgis.com/fUWVlHWZNxUvTUh8/arcgis/rest/services/ulicni_sit/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json',
});
