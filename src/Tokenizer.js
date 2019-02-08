// @flow
import type { SegmentToken } from './module/type';

export default class Tokenizer {
  /**
   * 分词模块管理器
   *
   * @param {Segment} 分词接口
   */
  constructor(segment) {
    this.segment = segment;
  }

  /**
   * 对一段文本进行分词
   *
   * @param {string} text 文本
   * @param {array} modules 分词模块数组
   * @return {array}
   */
  split(text, modules): SegmentToken[] {
    if (modules.length < 1) {
      throw Error('No tokenizer module!');
    }
    // 按顺序分别调用各个module来进行分词 ： 各个module仅对没有识别类型的单词进行分词
    let result = [{ w: text }];
    modules.forEach(module => {
      result = module.split(result);
    });
    return result;
  }
}
