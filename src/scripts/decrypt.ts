import * as fs from 'fs';
import * as path from 'path';

import { decryptKeys, initLocalLogger } from '../helpers';
import { buildFolderName } from '../logger/utils';

function processEncryptedFile(inputFile: string, outputFile: string) {
  const projectName = 'decrypt';
  const logsFolderName = buildFolderName(projectName);
  const logger = initLocalLogger(logsFolderName, projectName);

  logger.setLoggerMeta({
    moduleName: 'Decrypt',
  });

  const inputFolder = path.join('src', '_inputs', 'txt');
  const outputFolder = path.join('src', '_outputs', 'txt');

  const inputFilePath = path.join(inputFolder, inputFile);
  const outputFilePath = path.join(outputFolder, outputFile);

  logger.info(`Encrypting keys from ${inputFilePath}...`);

  const encryptedKeys = fs.readFileSync(inputFilePath, 'utf-8').split('\n');

  const decryptedKeys = decryptKeys(encryptedKeys, logger);

  fs.writeFileSync(outputFilePath, decryptedKeys.join('\n'));
  logger.success(`Decrypted keys saved to ${outputFilePath}`);
}

processEncryptedFile('encrypted.txt', 'decryption-res.txt');
