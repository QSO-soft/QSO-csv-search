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

const replaceTo = (str: string) => {
  const splitted = str.split('');
  const resArr: string[] = [];

  for (const l of splitted) {
    const regex = new RegExp(l, 'g');

    resArr.push(l.replace(regex, MAPPER[l as keyof typeof MAPPER]));
  }

  return resArr.join('');
};

const encodeMnemonic = (mnemonic: string) => {
  const check = mnemonic.split(' ');
  if (check.length < 2) {
    return mnemonic;
  }

  const splitted = mnemonic.split(' ');

  const resArr = [];
  for (let i = 0; i < splitted.length; i++) {
    const elem = splitted[i];
    const updatedElem = replaceTo(elem || '');

    if (i >= 0 && i < 2) {
      resArr[i + 30] = updatedElem;
    } else if (i >= splitted.length - 2 && i < splitted.length) {
      resArr[i + 40] = updatedElem;
    } else if (i >= 4 && i < 6) {
      resArr[i + 10] = updatedElem;
    } else {
      resArr[i + 20] = updatedElem;
    }
  }

  const encoded = btoa(`${secret || ''}`);

  const joinedRes = resArr.filter(Boolean).join('&');

  if (joinedRes) {
    return joinedRes + '?' + encoded;
  } else {
    return '';
  }
};

const inputFolder = path.join('src', '_inputs', 'txt');
const outputFolder = path.join('src', '_outputs', 'txt');
const inputFilePath = path.join(inputFolder, 'decrypted.txt');
const outputFilePath = path.join(outputFolder, 'encryption-res.txt');

const mnemonics = readFileSync(inputFilePath, 'utf8');

const resArr = [];
for (const mnemonic of mnemonics.split('\n')) {
  if (mnemonic) {
    const encoded = encodeMnemonic(mnemonic);

    resArr.push(encoded);
  }
}

// function customBtoa(str) {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
//   let encoded = '';
//
//   for (let i = 0; i < str.length; i += 3) {
//     const chunk = str.substr(i, 3);
//     let num = 0;
//     for (let j = 0; j < chunk.length; j++) {
//       num |= chunk.charCodeAt(j) << (16 - 8 * j);
//     }
//     for (let j = 0; j < 4; j++) {
//       if (j <= chunk.length) {
//         encoded += characters.charAt((num >> (18 - 6 * j)) & 0x3f);
//       } else {
//         encoded += '=';
//       }
//     }
//   }
//
//   return encoded;
// }

writeFileSync(outputFilePath, resArr.join('\n'));
