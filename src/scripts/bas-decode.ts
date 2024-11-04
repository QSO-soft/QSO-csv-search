// let mnemonic = '{-Variable.mnemonic-}';
import { readFileSync } from 'fs';
import { writeFileSync } from 'node:fs';
import path from 'path';

import yargs from 'yargs';

const slicedArgv = process.argv.slice(2);
const argv = await yargs().demandCommand(0, 'Secret phrase are required').parse(slicedArgv);
const [secret] = argv._;

const MAPPER =
  'eyIwIjoiYUIzXnpYIiwiMSI6IkxAcDglSyIsIjIiOiJyMSFjUTkiLCIzIjoiTStaNyR3IiwiNCI6IjNkX3NUcCIsIjUiOiJuUTUjdUoiLCI2IjoieUw5KldhIiwiNyI6IlFwXkw4bSIsIjgiOiJ3WiE5S3IiLCI5IjoibVEwIW5SIiwiYSI6ImNsT2xoZ3ciLCJiIjoicmd0T2c0IiwiYyI6InZIbi9TbmMiLCJkIjoiY2ttTEpzIiwiZSI6Ik5BeE1AejAiLCJmIjoiR2Yka1lqbyIsImciOiJIb0VOKmQ0IiwiaCI6ImIxR2dTSSIsImkiOiJyb3g1YVV3IiwiaiI6IlVEZTVGZyIsImsiOiJxel92QjRFIiwibCI6IkdodnM5am8iLCJtIjoiZEYvNGdVIiwibiI6IjgvZHledjQiLCJvIjoiNm8zbEFJbyIsInAiOiJ1TEMvJXc0IiwicSI6Ik5pK2Fhb1UiLCJyIjoiblBUV1hRIiwicyI6IlFxVE04NCIsInQiOiJWT1BJdlkiLCJ1Ijoib0MrbGtiRSIsInYiOiJJT0h6cyIsInciOiJiNF1rZlZjIiwieCI6IlRiPXFqc2siLCJ5IjoiYmdCKzlMSSIsInoiOiIxcDh0NEkiLCJBIjoibUowJXZDIiwiQiI6IkxwOStRayIsIkMiOiJUIzduVnAiLCJEIjoiUHQ5IXpKIiwiRSI6Im5KMF52VCIsIkYiOiJQXjdkUW4iLCJHIjoiVSMzektqIiwiSCI6InJLMCtReCIsIkkiOiJiWjE9alIiLCJKIjoiRnkzQGpSIiwiSyI6InlGNiF2USIsIkwiOiJvWjUkcEwiLCJNIjoiViMyalh5IiwiTiI6ImJaOV93WSIsIk8iOiJvRjY9ckwiLCJQIjoidEY5JXFZIiwiUSI6InRNNyVqSyIsIlIiOiJYcEAyTCQiLCJTIjoiYlQ0K05wIiwiVCI6InlMMCFrQyIsIlUiOiJ3TTgka0YiLCJWIjoiUXo3PXJNIiwiVyI6IndGOSF0TCIsIlgiOiJ4QzNecEsiLCJZIjoibVI4X3BGIiwiWiI6IldrMF5UciIsIiAiOiJuTDgkcEMifQ==';

const replaceFrom = (str: string) => {
  const entriesMapper = Object.entries(JSON.parse(atob(MAPPER)));

  let resStr = str;
  for (const [key, value] of entriesMapper) {
    const escapedString = (value as string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedString, 'g');

    resStr = resStr.replace(regex, key);
  }

  return resStr;
};
const unshuffleStringByPattern = (shuffledStr: string) => {
  const arr = shuffledStr.split('');
  const originalArr = Array(arr.length);

  for (let i = 0; i < arr.length; i++) {
    if (hasDivisibleByTenAfter(i, arr)) {
      const block = Math.floor(i / 10) * 10;
      const originalIndex = ((i - 3 + 10) % 10) + block;
      originalArr[originalIndex] = arr[i];
    } else {
      originalArr[i] = arr[i];
    }
  }

  return originalArr.join('');
};

const hasDivisibleByTenAfter = (currentIndex: number, arr: any[]) => {
  for (let j = currentIndex + 1; j < arr.length; j++) {
    if (j % 10 === 0) {
      return true;
    }
  }
  return false;
};

const decodeMnemonic = (encoded: string) => {
  const encodedPaths = encoded.split('?');

  const encodedSecret = encodedPaths[1];

  const decodedSecret = atob(encodedSecret || '');

  if (decodedSecret !== secret) {
    return '.';
  }

  const resStr = (encodedPaths[0] || '')
    .split('&')
    .map((el) => replaceFrom(el))
    .join('');
  return unshuffleStringByPattern(resStr);
};

const inputFolder = path.join('src', '_inputs', 'txt');
const outputFolder = path.join('src', '_outputs', 'txt');
const inputFilePath = path.join(inputFolder, 'encrypted.txt');
const outputFilePath = path.join(outputFolder, 'decryption-res.txt');

const mnemonics = readFileSync(inputFilePath, 'utf8');

const resArr = [];

for (const mnemonic of mnemonics.split('\n')) {
  if (mnemonic) {
    const encoded = decodeMnemonic(mnemonic);

    resArr.push(encoded);
  }
}

writeFileSync(outputFilePath, resArr.join('\n'));
