import words from './words.json';
import { randomInt } from 'crypto';
import cyrillicToTranslit from 'cyrillic-to-translit-js';

type Callback<T> = (err: unknown, result: T | undefined) => void;
type CallbackArgs<TArgs extends unknown[], TResult> = [...TArgs, Callback<TResult>];
type FnWithCallback<TThis, TArgs extends unknown[], TResult> = (this: TThis, ...args: CallbackArgs<TArgs, TResult>) => unknown;
type FnPromise<TThis, TArgs extends unknown[], TResult> = (this: TThis, ...args: TArgs) => Promise<TResult>;

function promisify<TThis, TArgs extends unknown[], TResult>(fn: FnWithCallback<TThis, TArgs, TResult>): FnPromise<TThis, TArgs, TResult> {
  return function (this: TThis, ...args: TArgs) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err: unknown, result: TResult | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(result!);
        }
      });
    });
  }
}

const randomIntP = promisify(randomInt);
const n = 4;
const randomWordIndex = await Promise.all(Array.from({ length: n }, () => randomIntP(0, words.length)));
const randomWords = randomWordIndex.map(i => words[i]);
const result = randomWords.join(' ');

console.log(result);
console.log((cyrillicToTranslit as any)().transform(result));
