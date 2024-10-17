import CryptoJS from 'crypto-js';
import yargs from 'yargs';

import { LoggerType } from '../logger';

const slicedArgv = process.argv.slice(2);
const argv = await yargs().demandCommand(0, 'Secret phrase are required').parse(slicedArgv);
const [secret] = argv._;

const isBase64 = (str: string): boolean => {
  try {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Base64.parse(str)) === str;
  } catch {
    return false;
  }
};

export const encryptKey = (originalKey: string, index: number, logger?: LoggerType) => {
  if (isBase64(originalKey)) {
    logger?.warning(`Line ${index + 1} already encrypted`);
    return originalKey;
  }

  return CryptoJS.AES.encrypt(originalKey, `${secret}`).toString();
};

export const decryptKey = (encryptedKey: string, index: number, logger?: LoggerType) => {
  if (!isBase64(encryptedKey)) {
    logger?.warning(`Line ${index + 1} already decrypted`);
    return encryptedKey;
  }

  const decryptedBytes = CryptoJS.AES.decrypt(encryptedKey, `${secret}`);

  return decryptedBytes.toString(CryptoJS.enc.Utf8);
};

export const encryptKeys = (decryptedKeys: string[], logger?: LoggerType): string[] => {
  return decryptedKeys.map((key, index) => {
    key = key.trim();
    if (!key) {
      return '';
    }
    return encryptKey(key, index, logger);
  });
};
export const decryptKeys = (encryptedKeys: string[], logger?: LoggerType): string[] => {
  return encryptedKeys.map((key, index) => {
    const errLine = `Secret phrase for line ${index + 1} is incorrect`;

    key = key.trim();
    if (!key) {
      return '';
    }
    try {
      const decryptedKey = decryptKey(key, index, logger);

      if (!decryptedKey) {
        logger?.error(errLine);
      }

      return decryptedKey;
    } catch (err) {
      const e = err as Error;
      const errorMessage = e.message;

      if (errorMessage.includes('Malformed UTF-8 data')) {
        logger?.error(errLine);

        return '';
      }

      throw err;
    }
  });
};
