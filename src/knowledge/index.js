// @flow
import { readFileSync } from 'fs';
import { join } from 'path';

// 盘古词典
export const pangu: string = readFileSync(join(__dirname, 'pangu.txt'), 'utf8');
// 扩展词典（用于调整原盘古词典）
export const panguExtend1: string = readFileSync(join(__dirname, 'panguExtend1.txt'), 'utf8');
export const panguExtend2: string = readFileSync(join(__dirname, 'panguExtend2.txt'), 'utf8');
// 常见名词、人名
export const names: string = readFileSync(join(__dirname, 'names.txt'), 'utf8');
// 通配符
export const wildcard: string = readFileSync(join(__dirname, 'wildcard.txt'), 'utf8');
// 同义词
export const synonym: string = readFileSync(join(__dirname, 'synonym.txt'), 'utf8');
// 停止符
export const stopword: string = readFileSync(join(__dirname, 'stopword.txt'), 'utf8');
