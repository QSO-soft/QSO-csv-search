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

      const isString = typeof filterValue === 'string';
      const isMoreOrLessFilter = isString && (filterValue.startsWith('>') || filterValue.startsWith('<'));
      const isIncludesFilter = isString && filterValue.startsWith('in=');
      const isNotIncludesFilter = isString && filterValue.startsWith('!in=');
      const isNotEmptyFilter = isString && filterValue.startsWith('!null');

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
      } else if (isIncludesFilter) {
        const searchPart = filterValue.split('in=')?.[1];
        const isOkay = ((data[filterKey as keyof typeof data] as string) || '').includes(`${searchPart}`);
        isOkayFilters.push(isOkay);
      }else if (isNotIncludesFilter) {
        const searchPart = filterValue.split('!in=')?.[1];
        const isOkay = !((data[filterKey as keyof typeof data] as string) || '').includes(`${searchPart}`);
        isOkayFilters.push(isOkay);
      } else if (isNotEmptyFilter) {
        const isOkay = !!data[filterKey as keyof typeof data];
        isOkayFilters.push(isOkay);
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
