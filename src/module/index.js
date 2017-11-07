// @flow
import AdjectiveOptimizer from './AdjectiveOptimizer';
import CHS_NAMES from './CHS_NAMES';
import ChsNameTokenizer from './ChsNameTokenizer';
import DictOptimizer from './DictOptimizer';
import EmailOptimizer from './EmailOptimizer';
import PunctuationTokenizer from './PunctuationTokenizer';
import URLTokenizer from './URLTokenizer';
import ChsNameOptimizer from './ChsNameOptimizer';
import DatetimeOptimizer from './DatetimeOptimizer';
import DictTokenizer from './DictTokenizer';
import ForeignTokenizer from './ForeignTokenizer';
import SingleTokenizer from './SingleTokenizer';
import WildcardTokenizer from './WildcardTokenizer';

export {
  AdjectiveOptimizer,
  CHS_NAMES,
  ChsNameTokenizer,
  DictOptimizer,
  EmailOptimizer,
  PunctuationTokenizer,
  URLTokenizer,
  ChsNameOptimizer,
  DatetimeOptimizer,
  DictTokenizer,
  ForeignTokenizer,
  SingleTokenizer,
  WildcardTokenizer,
};

export const modules = [
  // 强制分割类单词识别
  URLTokenizer, // URL识别
  WildcardTokenizer, // 通配符，必须在标点符号识别之前
  PunctuationTokenizer, // 标点符号识别
  ForeignTokenizer, // 外文字符、数字识别，必须在标点符号识别之后
  // 中文单词识别
  DictTokenizer, // 词典识别
  ChsNameTokenizer, // 人名识别，建议在词典识别之后
  // 优化模块
  EmailOptimizer, // 邮箱地址识别
  ChsNameOptimizer, // 人名识别优化
  DictOptimizer, // 词典识别优化
  DatetimeOptimizer, // 日期时间识别优化
  AdjectiveOptimizer,
];

export { Module, Tokenizer, Optimizer } from './BaseModule';
export type { SegmentToken, TokenStartPosition } from './type';
