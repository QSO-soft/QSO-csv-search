import { SETTINGS } from '../_inputs/settings';
import { Filter } from '../types';

interface FilterData {
  input: object[];
}
export const filterData = ({ input }: FilterData) => {
  const { useFilter, ...filters } = SETTINGS.filters;

  const foundData: object[] = [];
  const notFoundData: object[] = [];

  for (const data of input) {
    const isOkayFilters = [];
    for (const filterKey in filters) {
      const filterValue = filters[filterKey] as Filter;

      const isNotInData = !(filterKey in data);
      if (isNotInData) {
        continue;
      }

      const isMoreOrLessFilter =
        typeof filterValue === 'string' && (filterValue.startsWith('>') || filterValue.startsWith('<'));
      if (isMoreOrLessFilter) {
        const value = data[filterKey as keyof typeof data];
        const isNotNumberValue = isNaN(+value);

        if (isNotNumberValue) {
          continue;
        }

        const numberPath = +filterValue.slice(1);

        if (filterValue.startsWith('>')) {
          const isOkay = +value >= numberPath;
          isOkayFilters.push(isOkay);

          continue;
        }

        if (filterValue.startsWith('<')) {
          const isOkay = +value <= numberPath;
          isOkayFilters.push(isOkay);
          continue;
        }
      } else if (filterValue === null) {
        const isOkay = data[filterKey as keyof typeof data] === '';
        isOkayFilters.push(isOkay);
      } else {
        const isOkay = data[filterKey as keyof typeof data] === `${filterValue}`;
        isOkayFilters.push(isOkay);
      }
    }

    if (isOkayFilters.every((res) => !!res)) {
      foundData.push(data);
    } else {
      notFoundData.push(data);
    }
  }

  return { foundData, notFoundData };
};
