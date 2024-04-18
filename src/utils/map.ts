import L from 'leaflet';
import { StreetInMap } from '../types/StreetInMap';

/**
 * Function draws street on map
 * @param map Map to draw on
 * @param name Name of the street that is being drawed
 * @param path Array of arrays of coordinates of street being drawed
 * @param color Color of which the street should be drawed
 * @returns New drawed street (StreetInMap object)
 */
export function drawOnMap(map: L.Map, name: string, path: [[]], color: string) {
  var streetInMapNew: StreetInMap = { name: name, lines: [] };
  const line = L.polyline(path, { color: color, opacity: 0.75 }).addTo(map);
  streetInMapNew.lines.push(line);
  return streetInMapNew;
}

/**
 * Function deletes street from map based on its name
 * @param streetsInMap Array of StreetsInMap (objects of streets drawed on map)
 * @param name Name of the street that is being removed
 */
export function deleteFromMap(streetsInMap: StreetInMap[], name: string) {
  const streetsInMapToDelete = streetsInMap.filter((street) => street.name === name);
  streetsInMapToDelete?.forEach((street) => {
    street?.lines?.forEach((line) => line.remove());
  });
}

export function deleteAllFromMap(streetsInMap: StreetInMap[]) {
  streetsInMap.forEach((street) => {
    street?.lines?.forEach((line) => line.remove());
  });
}

/**
 * Function deletes streets from map (which should be removed based on the new selection) and return new list of streets that are kept drawn
 * @param streetsInMap Array of StreetInMap (objects of streets drawed on map)
 * @param streetsInSelected Array of street names (string) of name of streets that should stay drawed
 * @param name Name of the street that is being removed
 * @returns Modified array of StreetInMap
 */
export function deleteMultipleFromMap(streetsInMap: StreetInMap[], streets: string[]) {
  console.log('🚀 ~ deleteMultipleFromMap ~ streetsInMap:', streetsInMap);
  const streetsInMapToDelete = streetsInMap?.filter((street) => streets.includes(street.name));
  console.log('🚀 ~ deleteMultipleFromMap ~ streetsInMapToDelete:', streetsInMapToDelete);
  streetsInMapToDelete?.forEach((street) => {
    street?.lines?.forEach((line) => line.remove());
  });
  const streetsInMapStaying = streetsInMap?.filter((street) => !streets.includes(street.name));
  return streetsInMapStaying;
}
