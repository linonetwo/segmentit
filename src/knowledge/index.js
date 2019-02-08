// @flow
import preval from 'preval.macro'

const imports = `
  const { readFileSync } = require('fs');
  const { join } = require('path');
`;

// 盘古词典
export const pangu: string = preval`${imports} readFileSync(join(__dirname, 'pangu.txt'), 'utf8')`;
// 扩展词典（用于调整原盘古词典）
export const panguExtend1: string = preval`${imports} readFileSync(join(__dirname, 'panguExtend1.txt'), 'utf8')`;
export const panguExtend2: string = preval`${imports} readFileSync(join(__dirname, 'panguExtend2.txt'), 'utf8')`;
// 常见名词、人名
export const names: string = preval`${imports} readFileSync(join(__dirname, 'names.txt'), 'utf8')`;
// 通配符
export const wildcard: string = preval`${imports} readFileSync(join(__dirname, 'wildcard.txt'), 'utf8')`;
// 同义词
export const synonym: string = preval`${imports} readFileSync(join(__dirname, 'synonym.txt'), 'utf8')`;
// 停止符
export const stopword: string = preval`${imports} readFileSync(join(__dirname, 'stopword.txt'), 'utf8')`;

// 字典集，方便 import
export const dicts: string[] = [pangu, panguExtend1, panguExtend2, names, wildcard];
export const synonyms: string[] = [synonym];
export const stopwords: string[] = [stopword];
