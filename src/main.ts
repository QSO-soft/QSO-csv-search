import { sep } from 'path';

import { SETTINGS } from './data/settings';
import { convertAndWriteToJSON, convertToCsvAndWrite, DataForCsv, getDirname } from './helpers';
import { Logger } from './logger';
import { buildFolderName } from './logger/utils';

interface Search {
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

  const searchField = SETTINGS.fieldToSearch;

  let foundRes: any[] = [];
  const notFoundRes: any[] = [];

  for (const { value_to_search } of search) {
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

  if (SETTINGS.withUpdate && foundRes.length) {
    const toUpdate = await convertAndWriteToJSON({
      inputPath: buildInputPath() + 'to-update.csv',
      logger,
    });

    const updatedFoundRes = [];
    let toSave = input;
    for (const row of foundRes) {
      const field = (row[searchField as keyof typeof row] as string)?.toLowerCase();

      const foundInUpdate = toUpdate.find(
        (row) => field === (row[searchField as keyof typeof row] as string)?.toLowerCase()
      );
      const restInputs = toSave.filter(
        (row) => field !== (row[searchField as keyof typeof row] as string)?.toLowerCase()
      );

      if (foundInUpdate) {
        toSave = [...restInputs, foundInUpdate];
        updatedFoundRes.push(foundInUpdate);
      } else {
        updatedFoundRes.push(row);
      }
    }

    convertToCsvAndWrite({
      data: toSave as DataForCsv,
      fileName: 'input.csv',
      outputPath: buildInputPath(),
    });

    logger.success('src/data/input.csv was updated', { status: 'succeeded' });

    foundRes = updatedFoundRes;
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
    outputPath: buildInputPath(),
  });

  logger.success('Found results saved to src/data/found.csv', { status: 'succeeded' });

  convertToCsvAndWrite({
    data: notFoundRes as unknown as DataForCsv,
    fileName: 'not-found.csv',
    outputPath: buildInputPath(),
  });

  logger.success('Not found results saved to src/data/not-found.csv', { status: 'succeeded' });

  convertToCsvAndWrite({
    data: duplicates as DataForCsv,
    fileName: 'duplicates.csv',
    outputPath: buildInputPath(),
  });

  logger.success('Duplicated results saved to src/data/duplicates.csv', { status: 'succeeded' });
})();
