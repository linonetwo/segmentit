// @flow
import preval from 'preval.macro';

const importExport = `
  const fs = require('fs');
  const path = require('path');
  module.exports = fs.readFileSync(path.join(__dirname, '`;
const tail = ".txt'), 'utf8')";

// 盘古词典
export const pangu: string = preval`${importExport}pangu${tail}`;
// 扩展词典（用于调整原盘古词典）
export const panguExtend1: string = preval`${importExport}panguExtend1${tail}`;
export const panguExtend2: string = preval`${importExport}panguExtend2${tail}`;
// 常见名词、人名
export const names: string = preval`${importExport}names${tail}`;
// 通配符
export const wildcard: string = preval`${importExport}wildcard${tail}`;
// 同义词
export const synonym: string = preval`${importExport}synonym${tail}`;
// 停止符
export const stopword: string = preval`${importExport}stopword${tail}`;

// 字典集，方便 import
export const dicts: string[] = [pangu, panguExtend1, panguExtend2, names, wildcard];
export const synonyms: string[] = [synonym];
export const stopwords: string[] = [stopword];
