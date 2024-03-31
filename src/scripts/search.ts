import { SETTINGS } from '../_inputs/settings';
import { buildCsvPath, convertAndWriteToJSON, convertToCsvAndWrite, DataForCsv, initLocalLogger } from '../helpers';
import { buildFolderName } from '../logger/utils';

interface Search {
  value_to_search: string;
}
interface Duplicate {
  duplicated_value: string;
}

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

    convertToCsvAndWrite({
      data: [{ [searchField]: '' }],
      fileName: 'found.csv',
      outputPath: buildCsvPath(true),
    });
    convertToCsvAndWrite({
      data: [{ field_to_search: '', value_to_search: '' }],
      fileName: 'not-found.csv',
      outputPath: buildCsvPath(true),
    });
    convertToCsvAndWrite({
      data: [{ duplicated_value: '' }],
      fileName: 'duplicates.csv',
      outputPath: buildCsvPath(true),
    });

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
  } catch (err) {
    logger.error((err as Error).message, {
      status: 'failed',
    });
  }
})();
