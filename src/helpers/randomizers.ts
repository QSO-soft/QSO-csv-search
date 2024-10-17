import random from 'lodash/random';
import sample from 'lodash/sample';

export const getRandomNumber = ([min, max]: [number, number], isInteger: boolean = false) =>
  random(min, max, !isInteger);

export const getRandomBigInt = ([min, max]: [bigint, bigint]) => {
  return BigInt(getRandomNumber([Number(min), Number(max)]));
};

export const getRandomNumberRange = ([min, max]: [number, number]) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomItemFromArray = <T>(array: T[]): T => sample(array) as T;
