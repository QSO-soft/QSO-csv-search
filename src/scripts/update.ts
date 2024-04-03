import { SETTINGS } from '../_inputs/settings';
import {
  buildCsvPath,
  clearData,
  convertAndWriteToJSON,
  convertToCsvAndWrite,
  DataForCsv,
  initLocalLogger,
} from '../helpers';
import { buildFolderName } from '../logger/utils';

(async () => {
  const projectName = 'update';
  const logsFolderName = buildFolderName(projectName);
  const logger = initLocalLogger(logsFolderName, projectName);

  logger.setLoggerMeta({
    moduleName: 'Update',
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
    const toUpdate = await convertAndWriteToJSON({
      inputPath: buildCsvPath() + 'to-update.csv',
      logger,
    });

    const duplicates: object[] = [];
    const uniqueToUpdate = toUpdate.reduce<object[]>((acc, data) => {
      const value = (data[searchField as keyof typeof data] as string) || '';
      if (!value) {
        return acc;
      }

      const isInAcc = acc.find(
        (data) => ((data[searchField as keyof typeof data] as string) || '').toLowerCase() === value.toLowerCase()
      );

      if (isInAcc) {
        duplicates.push(data);
        return acc;
      } else {
        return [...acc, data];
      }
    }, []);

    const toSave: object[] = [];
    const notFound: object[] = [];

    let restInput = input;
    for (const row of uniqueToUpdate) {
      const searchValue = ((row[searchField as keyof typeof row] as string) || '')?.toLowerCase();

      const updatedRestInput = [];
      let foundInput: object | null = null;

      for (const inputRow of restInput) {
        const inputRowValue = ((inputRow[searchField as keyof typeof inputRow] as string) || '')?.toLowerCase();

        if (inputRowValue === searchValue) {
          foundInput = inputRow;
        } else {
          updatedRestInput.push(inputRow);
        }
      }
      restInput = updatedRestInput;

      if (foundInput) {
        const updateEntries = Object.entries(row);

        const filteredObject: any = {};
        for (const [key, value] of updateEntries) {
          if (value !== undefined && value !== '') {
            filteredObject[key] = value;
          }
        }

        toSave.push({ ...row, ...filteredObject });
      } else {
        notFound.push(row);
      }
    }
    toSave.push(...restInput);

    convertToCsvAndWrite({
      data: toSave as DataForCsv,
      fileName: 'input.csv',
      outputPath: buildCsvPath(),
    });

    logger.success('src/_inputs/csv/input.csv was updated', { status: 'succeeded' });

    if (duplicates.length) {
      convertToCsvAndWrite({
        data: duplicates as unknown as DataForCsv,
        fileName: 'duplicates.csv',
        outputPath: buildCsvPath(true),
      });

      logger.success('Duplicated to-update saved to src/_outputs/csv/duplicates.csv', { status: 'succeeded' });
    }

    if (notFound.length) {
      convertToCsvAndWrite({
        data: notFound as unknown as DataForCsv,
        fileName: 'not-found.csv',
        outputPath: buildCsvPath(true),
      });

      logger.success('Not found data saved to src/_outputs/csv/not-found.csv', { status: 'succeeded' });
    }

    process.exit(0);
  } catch (err) {
    logger.error((err as Error).message, {
      status: 'failed',
    });
    process.exit(1);
  }
})();
