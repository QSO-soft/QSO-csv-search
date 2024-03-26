import { sep } from 'path';

import { SETTINGS } from './data/settings';
import { convertAndWriteToJSON, convertToCsvAndWrite, DataForCsv, getDirname } from './helpers';
import { Logger } from './logger';
import { buildFolderName } from './logger/utils';

interface Search {
  field_to_search: string;
  value_to_search: string;
}
const buildFileName = (fileName: string) => {
  return `${fileName}.log`;
};
export const initLocalLogger = (folderName: string, fileName: string) =>
  new Logger(folderName, buildFileName(fileName));

const buildInputPath = () => {
  return `${getDirname()}${sep}..${sep}data${sep}`;
};

(async () => {
  const logsFolderName = buildFolderName(`..${sep}data${sep}logs`);
  const logger = initLocalLogger(logsFolderName, 'main');

  logger.setLoggerMeta({
    moduleName: 'Main',
  });
  logger.info('Starting script...', {
    status: 'in progress',
  });

  const input = await convertAndWriteToJSON({
    inputPath: buildInputPath() + 'input.csv',
    logger,
  });
  const search = (await convertAndWriteToJSON({
    inputPath: buildInputPath() + 'search.csv',
    logger,
  })) as Search[];

  let foundResults = search.reduce<(Search & object)[]>((acc, cur, currentIndex) => {
    let searchField = cur.field_to_search;

    if (!searchField) {
      const prevRes = acc[currentIndex - 1] || acc[0];

      if (prevRes && 'field_to_search' in prevRes && prevRes.field_to_search) {
        searchField = prevRes.field_to_search as string;
      } else {
        logger.error(`No search field for value ${cur.value_to_search}`, {
          status: 'failed',
        });
        return acc;
      }
    }

    const foundRes = input.filter((row) => {
      const rowField = row[searchField as keyof typeof row];
      return searchField in row && rowField && rowField === cur.value_to_search;
    });

    const searchObj = {
      field_to_search: searchField,
      value_to_search: cur.value_to_search,
    };
    if (foundRes.length) {
      const transformedRes = foundRes.map((obj) => ({
        ...searchObj,
        ...obj,
      }));
      return [...acc, ...transformedRes];
    }

    return [...acc, searchObj];
  }, []);

  if (SETTINGS.withUpdate && foundResults.length) {
    const toUpdate = await convertAndWriteToJSON({
      inputPath: buildInputPath() + 'to-update.csv',
      logger,
    });

    let toSave = input;
    foundResults = foundResults.reduce<(Search & object)[]>((acc, cur) => {
      const { field_to_search, value_to_search } = cur;

      const foundToUpdate = toUpdate.find((row) => {
        const rowField = row[field_to_search as keyof typeof row];
        return field_to_search in row && rowField && rowField === value_to_search;
      });
      const restInputs = toSave.filter((row) => {
        const rowField = row[field_to_search as keyof typeof row];
        return field_to_search in row && rowField && rowField !== value_to_search;
      });

      if (foundToUpdate) {
        toSave = [...restInputs, foundToUpdate];
        const updated = {
          ...cur,
          ...foundToUpdate,
        };

        return [...acc, updated];
      }

      return [...acc, cur];
    }, []);

    convertToCsvAndWrite({
      data: toSave as DataForCsv,
      fileName: 'input.csv',
      outputPath: buildInputPath(),
    });

    logger.success('src/data/input.csv was updated', { status: 'succeeded' });
  }
  convertToCsvAndWrite({
    data: foundResults as DataForCsv,
    fileName: 'output.csv',
    outputPath: buildInputPath(),
  });

  logger.success('Found results saved to src/data/output.csv', { status: 'succeeded' });
})();
