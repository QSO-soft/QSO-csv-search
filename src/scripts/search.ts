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

    const duplicates: Duplicate[] = [];
    const uniqueSearch = search.reduce<Search[]>((acc, row) => {
      const value = row.value_to_search.toLowerCase();

      const isInAcc = acc.find((row) => row.value_to_search.toLowerCase() === value);
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
    const notFoundRes: object[] = [];

    if (SETTINGS.filters.useFilter) {
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
      convertToCsvAndWrite({
        data: notFoundRes as unknown as DataForCsv,
        fileName: 'not-found.csv',
        outputPath: buildCsvPath(true),
      });

      logger.success('Not found results saved to src/_outputs/csv/not-found.csv', { status: 'succeeded' });
    }

    if (duplicates.length) {
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
