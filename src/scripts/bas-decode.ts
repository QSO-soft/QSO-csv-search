// let mnemonic = '{-Variable.mnemonic-}';
import { readFileSync } from 'fs';
import { writeFileSync } from 'node:fs';
import path from 'path';

import yargs from 'yargs';

const slicedArgv = process.argv.slice(2);
const argv = await yargs().demandCommand(0, 'Secret phrase are required').parse(slicedArgv);
const [secret] = argv._;

const MAPPER = {
  a: 'clOlhgw',
  b: 'rgtOg4',
  c: 'vHn/Snc',
  d: 'ckmLJs',
  e: 'NAxM@z0',
  f: 'Gf$kYjo',
  g: 'HoEN*d4',
  h: 'b1GgSI',
  i: 'rox5aUw',
  j: 'UDe5Fg',
  k: 'qz_vB4E',
  l: 'Ghvs9jo',
  m: 'dF/4gU',
  n: '8/dy^v4',
  o: '6o3lAIo',
  p: 'uLC/%w4',
  q: 'Ni+aaoU',
  r: 'nPTWXQ',
  s: 'QqTM84',
  t: 'VOPIvY',
  u: 'oC+lkbE',
  v: 'IOHzs',
  w: 'b4]kfVc',
  x: 'Tb=qjsk',
  y: 'bgB+9LI',
  z: '1p8t4I',
};

const replaceFrom = (str: string) => {
  const entriesMapper = Object.entries(MAPPER);

  let resStr = str;
  for (const [key, value] of entriesMapper) {
    const escapedString = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedString, 'g');

    resStr = resStr.replace(regex, key);
  }

  return resStr;
};

const decodeMnemonic = (encoded: string) => {
  const check = encoded.split(' ');
  if (check.length === 12) {
    return encoded;
  }

  const encodedPaths = encoded.split('?');

  const splittedEncoded = encodedPaths[0]?.split('&');
  const encodedSecret = encodedPaths[1];

  const decodedSecret = atob(encodedSecret || '');
  // console.log({ decodedSecret });

  if (decodedSecret !== secret) {
    return 'lol';
  }

  const resArr = [];

  for (let i = 0; i < (splittedEncoded?.length || 0); i++) {
    const elem = splittedEncoded?.[i];
    const updatedElem = replaceFrom(elem || '');

    if (i >= 0 && i < 2) {
      resArr[i + 30] = updatedElem;
    } else if (i >= 4 && i < 6) {
      resArr[i + 40] = updatedElem;
    } else if (i >= 6 && i < 8) {
      resArr[i + 50] = updatedElem;
    } else if (i >= 8 && i < 10) {
      resArr[i + 10] = updatedElem;
    } else if (i >= 2 && i < 4) {
      resArr[i + 20] = updatedElem;
    } else {
      resArr[i + 60] = updatedElem;
    }
  }

  return resArr.filter(Boolean).join(' ');
};

function customAtob(encoded: string) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  const bufferLength = encoded.length * 0.75;
  const len = encoded.length;

  let i,
    p = 0;
  const encoded1 = new Uint8Array(bufferLength);

  for (i = 0; i < len; i += 4) {
    const encoded2 =
      (characters.indexOf(encoded[i] || '') << 18) |
      (characters.indexOf(encoded[i + 1] || '') << 12) |
      (characters.indexOf(encoded[i + 2] || '') << 6) |
      characters.indexOf(encoded[i + 3] || '');

    encoded1[p++] = (encoded2 >> 16) & 0xff;
    encoded1[p++] = (encoded2 >> 8) & 0xff;
    encoded1[p++] = encoded2 & 0xff;
  }

  return String.fromCharCode.apply(null, Array.from(encoded1)).slice(0, -1);
}

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
