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
  A: 'mJ0%vC',
  B: 'Lp9+Qk',
  C: 'T#7nVp',
  D: 'Pt9!zJ',
  E: 'nJ0^vT',
  F: 'P^7dQn',
  G: 'U#3zKj',
  H: 'rK0+Qx',
  I: 'bZ1=jR',
  J: 'Fy3@jR',
  K: 'yF6!vQ',
  L: 'oZ5$pL',
  M: 'V#2jXy',
  N: 'bZ9_wY',
  O: 'oF6=rL',
  P: 'tF9%qY',
  Q: 'tM7%jK',
  R: 'Xp@2L$',
  S: 'bT4+Np',
  T: 'yL0!kC',
  U: 'wM8$kF',
  V: 'Qz7=rM',
  W: 'wF9!tL',
  X: 'xC3^pK',
  Y: 'mR8_pF',
  Z: 'Wk0^Tr',
  0: 'aB3^zX',
  1: 'L@p8%K',
  2: 'r1!cQ9',
  3: 'M+Z7$w',
  4: '3d_sTp',
  5: 'nQ5#uJ',
  6: 'yL9*Wa',
  7: 'Qp^L8m',
  8: 'wZ!9Kr',
  9: 'mQ0!nR',
  ' ': 'nL8$pC',
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
const shuffleStringByPattern = (str: string) => {
  const arr = str.split('');
  const shuffledArr = Array(arr.length);

  for (let i = 0; i < arr.length; i++) {
    if (hasDivisibleByTenAfter(i, arr)) {
      const block = Math.floor(i / 10) * 10;
      const newIndex = ((i + 3) % 10) + block;
      shuffledArr[newIndex] = arr[i];
    } else {
      shuffledArr[i] = arr[i];
    }
  }

  return shuffledArr.join('');
};

const hasDivisibleByTenAfter = (currentIndex: number, arr: any[]) => {
  for (let j = currentIndex + 1; j < arr.length; j++) {
    if (j % 10 === 0) {
      return true;
    }
  }
  return false;
};

const encodeMnemonic = (mnemonic: string) => {
  const resStr = shuffleStringByPattern(mnemonic)
    .split('')
    .map((el) => replaceTo(el))
    .join('&');
  const encoded = btoa(`${secret || ''}`);

  if (resStr) {
    return resStr + '?' + encoded;
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

writeFileSync(outputFilePath, resArr.join('\n'));
