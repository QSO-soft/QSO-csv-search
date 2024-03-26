import { sep } from 'path';

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

  const res = search.reduce<object[]>((acc, cur, currentIndex) => {
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

  convertToCsvAndWrite({
    data: res as DataForCsv,
    fileName: 'output.csv',
    outputPath: buildInputPath(),
  });

  logger.success('Results saved to src/data/output.csv', { status: 'succeeded' });
})();
