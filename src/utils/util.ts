import { SelectProps } from 'antd';
import { Streets } from '../types/baseTypes';
import useAxios from './useAxios';

export function getOptionsFromStreet(streets: Streets | null, streetsInRoute: string[] | null) {
  if (streets == null) {
    return;
  }
  const options: SelectProps['options'] = [];
  // mapping streets to Select options
  streets?.features?.map(({ attributes }, index) =>
    options.push({
      label: attributes.nazev,
      value: attributes.nazev,
      disabled: streetsInRoute?.includes(attributes.nazev),
    }),
  );
  // sorting values
  options.sort((val1, val2) => val1?.value?.toString().localeCompare(val2?.value.toString()));

  return options;
}
