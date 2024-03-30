import path, { sep } from 'path';

import { Logger, LoggerData } from '../logger';
import { getDirname } from './get-dirname';

export interface TemplateData extends LoggerData {
  moduleName?: string;
}

export const msgToTemplateTransform = (msg: string, templateData?: TemplateData) => {
  if (!templateData) {
    return msg;
  }

  const { id, moduleName, action, status, txId } = templateData;
  const templateString = [];

  id && templateString.push(`[${id}]`);

  moduleName && templateString.push(`[${moduleName}]`);

  action && templateString.push(`[${action}]`);

  txId && templateString.push(`[TX: №${txId}]`);

  status && templateString.push(`[${status}]`);

  msg && templateString.push(`- ${msg}`);

  return templateString.join(' ');
};

export const assert = (condition: boolean, message?: string): void => {
  if (!condition) {
    throw new Error(`Assertion failed: ${message || 'Unknown error'}`);
  }
};

export const buildLogFileName = (fileName: string) => {
  return `${fileName}.log`;
};

export const buildCsvPath = (isOutput: boolean = false) => {
  return path.join(getDirname(), '..', isOutput ? '_outputs' : '_inputs', 'csv', sep);
};

export const initLocalLogger = (folderName: string, fileName: string) =>
  new Logger(folderName, buildLogFileName(fileName));
