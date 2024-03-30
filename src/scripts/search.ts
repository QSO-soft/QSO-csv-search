import uniqBy from 'lodash/uniqBy';

import { SETTINGS } from '../_inputs/settings';
import { buildCsvPath, convertAndWriteToJSON, convertToCsvAndWrite, DataForCsv, initLocalLogger } from '../helpers';
import { buildFolderName } from '../logger/utils';

interface Search {
  value_to_search: string;
}

(async () => {
  const projectName = 'search';
  const logsFolderName = buildFolderName(projectName);
  const logger = initLocalLogger(logsFolderName, projectName);

  logger.setLoggerMeta({
    moduleName: 'Search',
  });

  try {
    logger.info('Starting script...', {
      status: 'in progress',
    });

    const input = await convertAndWriteToJSON({
      inputPath: buildCsvPath() + 'input.csv',
      logger,
    });
    const search = (await convertAndWriteToJSON({
      inputPath: buildCsvPath() + 'search.csv',
      logger,
    })) as Search[];
    const uniqueSearch = uniqBy(search, 'value_to_search');

    const searchField = SETTINGS.fieldToSearch;

    const foundRes: any[] = [];
    const notFoundRes: any[] = [];

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

    const duplicates: any[] = [];
    const unique = foundRes.reduce<any[]>((acc, row) => {
      const field = (row[searchField as keyof typeof row] as string).toLowerCase();

      const isInAcc = acc.find((row) => (row[searchField as keyof typeof row] as string).toLowerCase() === field);
      if (isInAcc) {
        duplicates.push(row);
        return acc;
      } else {
        return [...acc, row];
      }
    }, []);

    convertToCsvAndWrite({
      data: unique as DataForCsv,
      fileName: 'found.csv',
      outputPath: buildCsvPath(true),
    });

    logger.success('Found results saved to src/_outputs/csv/found.csv', { status: 'succeeded' });

    convertToCsvAndWrite({
      data: notFoundRes as unknown as DataForCsv,
      fileName: 'not-found.csv',
      outputPath: buildCsvPath(true),
    });

    logger.success('Not found results saved to src/_outputs/csv/not-found.csv', { status: 'succeeded' });

    convertToCsvAndWrite({
      data: duplicates as DataForCsv,
      fileName: 'duplicates.csv',
      outputPath: buildCsvPath(true),
    });

    logger.success('Duplicated results saved to src/_outputs/csv/duplicates.csv', { status: 'succeeded' });
  } catch (err) {
    logger.error((err as Error).message, {
      status: 'failed',
    });
  }
})();
