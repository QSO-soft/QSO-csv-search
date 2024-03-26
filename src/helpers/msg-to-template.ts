import { LoggerData } from '../logger';

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
