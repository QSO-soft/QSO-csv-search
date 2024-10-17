import * as fs from 'fs';
import * as path from 'path';

import { encryptKeys, initLocalLogger } from '../helpers';
import { buildFolderName } from '../logger/utils';

export const processDecryptedFile = (inputFile: string, outputFile: string) => {
  const projectName = 'encrypt';
  const logsFolderName = buildFolderName(projectName);
  const logger = initLocalLogger(logsFolderName, projectName);

  logger.setLoggerMeta({
    moduleName: 'Encrypt',
  });

  const inputFolder = path.join('src', '_inputs', 'txt');
  const outputFolder = path.join('src', '_outputs', 'txt');

  const inputFilePath = path.join(inputFolder, inputFile);
  const outputFilePath = path.join(outputFolder, outputFile);

  logger.info(`Encrypting keys from ${inputFilePath}...`);

  const decryptedKeys = fs.readFileSync(inputFilePath, 'utf-8').split('\n');

  const encryptedKeys = encryptKeys(decryptedKeys, logger);

  fs.writeFileSync(outputFilePath, encryptedKeys.join('\n'));
  logger.success(`Encrypted keys saved to ${outputFilePath}`);
};

processDecryptedFile('decrypted.txt', 'encryption-res.txt');
