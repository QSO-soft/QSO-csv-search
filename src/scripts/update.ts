import { SETTINGS } from '../_inputs/settings';
import { buildCsvPath, convertAndWriteToJSON, convertToCsvAndWrite, DataForCsv, initLocalLogger } from '../helpers';
import { buildFolderName } from '../logger/utils';

(async () => {
  const projectName = 'update';
  const logsFolderName = buildFolderName(projectName);
  const logger = initLocalLogger(logsFolderName, projectName);

  logger.setLoggerMeta({
    moduleName: 'Update',
  });

  try {
    logger.info('Starting script...', {
      status: 'in progress',
    });

    const input = await convertAndWriteToJSON({
      inputPath: buildCsvPath() + 'input.csv',
      logger,
    });
    const toUpdate = await convertAndWriteToJSON({
      inputPath: buildCsvPath() + 'to-update.csv',
      logger,
    });

    const searchField = SETTINGS.fieldToSearch;

    const toSave: any[] = [];
    for (const row of input) {
      const inputField = (row[searchField as keyof typeof row] as string)?.toLowerCase();
      const updateObj = toUpdate.find(
        (row) => (row[searchField as keyof typeof row] as string)?.toLowerCase() === inputField
      );

      if (updateObj) {
        const updateEntries = Object.entries(updateObj);

        const filteredObject: any = {};
        for (const [key, value] of updateEntries) {
          if (value !== undefined && value !== '') {
            filteredObject[key] = value;
          }
        }

        toSave.push({ ...row, ...filteredObject });
      } else {
        toSave.push(row);
      }
    }

    convertToCsvAndWrite({
      data: toSave as DataForCsv,
      fileName: 'input.csv',
      outputPath: buildCsvPath(),
    });

    logger.success('src/_inputs/csv/input.csv was updated', { status: 'succeeded' });
  } catch (err) {
    logger.error((err as Error).message, {
      status: 'failed',
    });
  }
})();
