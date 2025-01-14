import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';

import { SETTINGS } from '../_inputs/settings';
import {
  buildCsvPath,
  clearData,
  convertAndWriteToJSON,
  convertToCsvAndWrite,
  DataForCsv,
  initLocalLogger,
} from '../helpers';
import { filterData } from '../helpers/filter-data';
import { buildFolderName } from '../logger/utils';
import { Duplicate, Search } from '../types';

(async () => {
  const projectName = 'search';
  const logsFolderName = buildFolderName(projectName);
  const logger = initLocalLogger(logsFolderName, projectName);

  logger.setLoggerMeta({
    moduleName: 'Search',
  });

  try {
    const searchField = SETTINGS.fieldToSearch;

    logger.info('Starting script...', {
      status: 'in progress',
    });

    clearData(logger);

    const input = await convertAndWriteToJSON({
      inputPath: buildCsvPath() + 'input.csv',
      logger,
    });
    const search = (await convertAndWriteToJSON({
      inputPath: buildCsvPath() + 'search.csv',
      logger,
    })) as Search[];

    if (SETTINGS.filters.useFilter && SETTINGS.filters.uniqueFields) {
      const uniqueInputs = uniqBy(input, searchField);

      if (uniqueInputs.length) {
        convertToCsvAndWrite({
          data: uniqueInputs as DataForCsv,
          fileName: 'found.csv',
          outputPath: buildCsvPath(true),
        });

        logger.success('Found results saved to src/_outputs/csv/found.csv', { status: 'succeeded' });
      }

      process.exit(0);
    }
    let duplicates: Duplicate[] = [];
    const uniqueSearch = search.reduce<Search[]>((acc, row) => {
      const value = row.value_to_search;

      const isInAcc = acc.find((row) => row.value_to_search.toLowerCase() === value.toLowerCase());
      if (isInAcc) {
        duplicates.push({
          duplicated_value: value,
        });
        return acc;
      } else {
        return [...acc, row];
      }
    }, []);

    let foundRes: object[] = [];
    let notFoundRes: object[] = [];

    const { useFilter } = SETTINGS.filters;
    if (useFilter) {
      const { foundData, notFoundData } = filterData({ input });
      foundRes.push(...foundData);
      notFoundRes.push(...notFoundData);
    } else {
      for (const { value_to_search } of uniqueSearch) {
        const foundInputs = input.filter(
          (row) => (row[searchField as keyof typeof row] as string)?.toLowerCase() === value_to_search.toLowerCase()
        );

        if (foundInputs.length) {
          foundRes.push(...foundInputs);
        } else {
          notFoundRes.push({
            field_to_search: searchField,
            value_to_search,
          });
        }
      }
    }

    const sortByField = SETTINGS.sortBy;
    const isDescSort = SETTINGS.sortOrder === 'DESC';

    if (sortByField) {
      foundRes = sortBy(foundRes, [sortByField]);

      if (isDescSort) {
        foundRes = foundRes.reverse();
      }
    }

    const fieldsToReceive = SETTINGS.fieldsToReceive;
    if (fieldsToReceive.length) {
      foundRes = foundRes.map((data) => {
        let updatedData = {};

        [searchField, ...fieldsToReceive].forEach((field) => {
          if (!(field in data)) {
            updatedData = {
              ...updatedData,
              [field]: '',
            };
          } else {
            updatedData = {
              ...updatedData,
              [field]: data[field as keyof typeof data],
            };
          }
        });
        return updatedData;
      });
    }

    if (foundRes.length) {
      convertToCsvAndWrite({
        data: foundRes as DataForCsv,
        fileName: 'found.csv',
        outputPath: buildCsvPath(true),
      });

      logger.success('Found results saved to src/_outputs/csv/found.csv', { status: 'succeeded' });
    }

    if (notFoundRes.length) {
      if (sortByField && sortByField === searchField) {
        if (useFilter) {
          notFoundRes = sortBy(notFoundRes, [sortByField]);
        } else {
          notFoundRes = sortBy(notFoundRes, ['value_to_search']);
        }

        if (isDescSort) {
          notFoundRes = notFoundRes.reverse();
        }
      }

      convertToCsvAndWrite({
        data: notFoundRes as unknown as DataForCsv,
        fileName: 'not-found.csv',
        outputPath: buildCsvPath(true),
      });

      logger.success('Not found results saved to src/_outputs/csv/not-found.csv', { status: 'succeeded' });
    }

    if (duplicates.length) {
      if (sortByField && sortByField === searchField) {
        duplicates = sortBy(duplicates, ['duplicated_value']);

        if (isDescSort) {
          duplicates = duplicates.reverse();
        }
      }

      convertToCsvAndWrite({
        data: duplicates as unknown as DataForCsv,
        fileName: 'duplicates.csv',
        outputPath: buildCsvPath(true),
      });

      logger.success('Duplicated searches saved to src/_outputs/csv/duplicates.csv', { status: 'succeeded' });
    }

    process.exit(0);
  } catch (err) {
    logger.error((err as Error).message, {
      status: 'failed',
    });
    process.exit(1);
  }
})();
