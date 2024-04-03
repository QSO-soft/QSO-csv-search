import { LoggerType } from '../logger';
import { convertToCsvAndWrite } from './csv-converters';
import { buildCsvPath } from './msg-to-template';

export const clearData = (logger: LoggerType) => {
  logger.info('Clearing previous data...', {
    status: 'in progress',
  });

  convertToCsvAndWrite({
    data: [],
    fileName: 'found.csv',
    outputPath: buildCsvPath(true),
  });
  convertToCsvAndWrite({
    data: [],
    fileName: 'not-found.csv',
    outputPath: buildCsvPath(true),
  });
  convertToCsvAndWrite({
    data: [],
    fileName: 'duplicates.csv',
    outputPath: buildCsvPath(true),
  });
};
