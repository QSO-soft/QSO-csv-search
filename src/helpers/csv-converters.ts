/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import fs from 'fs';

import csvtojson from 'csvtojson';

import { LoggerData, LoggerType } from '../logger';
import { printResults } from './print';

interface ConvertAndWriteToJson {
  inputPath: string;
  outputPath?: string;
  logger?: LoggerType;
  withSaving?: boolean;
}
export const convertAndWriteToJSON = async ({ inputPath, outputPath, logger, withSaving }: ConvertAndWriteToJson) => {
  const jsonArray: object[] = [];
  const logTemplate: LoggerData = {
    action: 'convertAndWriteToJSON',
    status: 'in progress',
  };

  logger?.info(`Reading from ${inputPath}...`, logTemplate);

  await csvtojson()
    .fromFile(inputPath)
    .subscribe(
      (jsonObj: object) => {
        const resObj: any = {};

        for (const [key, value] of Object.entries(jsonObj)) {
          // const replaced = value.replace(',', '.');

          // if (isNaN(+replaced)) {
          resObj[key] = value;
          // } else {
          // resObj[key] = replaced;
          // }
        }

        jsonArray.push(resObj);
      },
      (error) => {
        if (error) {
          logger?.error('Error reading CSV file in subscribe block! Probably wrong path or file name', {
            ...logTemplate,
            status: 'failed',
          });
        }
      }
    )
    .on('done', (error) => {
      if (error) {
        logger?.error('Error reading data from subscription CSV file! Probably wrong path or file name', {
          ...logTemplate,
          status: 'failed',
        });
      }

      if (withSaving) {
        if (outputPath && jsonArray?.length) {
          logger?.info(`Writing JSON to ${outputPath}...`, logTemplate);

          if (!fs.existsSync(outputPath)) {
            fs.writeFileSync(outputPath, '');
          }

          fs.writeFileSync(outputPath, JSON.stringify(jsonArray, null, 2));
        } else {
          logger?.error('Error writing data to JSON file! Probably wrong path or file name', logTemplate);
        }
      }
    });

  return jsonArray;
};

interface ReadAndParseFromJSON {
  inputPath: string;
  encode?: BufferEncoding;
  logger?: LoggerType;
}
export const readAndParseFromJSON = async ({ inputPath, encode, logger }: ReadAndParseFromJSON): Promise<object> => {
  const logTemplate: LoggerData = {
    action: 'readAndParseFromJSON',
    status: 'in progress',
  };

  logger?.info(`Reading from ${inputPath}...`, logTemplate);

  const encoding = encode ?? 'utf8',
    data = await fs.promises.readFile(inputPath, encoding);

  logger?.info(`Parsing data from ${inputPath}...`, logTemplate);

  return JSON.parse(data) as object;
};

export type DataForCsv = Record<string, string | number | undefined>[];
export const convertToCSV = (data: DataForCsv, columnDelimiter = ',', lineDelimiter = '\n') => {
  let csvString = '';

  const allKeys = data.reduce<string[]>((acc, item) => [...acc, ...Object.keys(item)], []);
  const headers = [...new Set(allKeys)];

  csvString += headers.join(columnDelimiter) + lineDelimiter;

  for (let i = 0; i < data.length; i++) {
    let ctr = 0;

    const item = data[i];

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      if (ctr > 0) {
        csvString += columnDelimiter;
      }

      const isItem = item && header && item[header] !== undefined;
      if (isItem) {
        const currentItem = `${item[header]}`;

        if (currentItem.includes(',')) {
          const replaced = currentItem.replaceAll(',', '.');
          if (isNaN(+replaced)) {
            csvString += `"${currentItem}"`;
          } else {
            csvString += currentItem.replaceAll(',', '.');
          }
        } else {
          csvString += currentItem;
        }
      }

      ctr++;
    }

    csvString += lineDelimiter;
  }

  return csvString;
};

interface ConvertToCsvAndWriteProps {
  data: DataForCsv;
  fileName: string;
  outputPath: string;
  columnDelimiter?: string;
  lineDelimiter?: string;
}

export const convertToCsvAndWrite = ({
  data,
  fileName,
  outputPath,
  columnDelimiter,
  lineDelimiter,
}: ConvertToCsvAndWriteProps) => {
  const csvStringData = convertToCSV(data, columnDelimiter, lineDelimiter);
  printResults({ data: csvStringData, fileName, outputPath });
};
