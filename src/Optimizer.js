// @flow
import type { SegmentToken } from './module/type';

export default class Optimizer {
  /**
   * 优化模块管理器
   *
   * @param {Segment} 分词接口
   */
  constructor(segment) {
    this.segment = segment;
  }

  /**
   * 分词一段文本
   *
   * @param {array} words 单词数组
   * @param {array} modules 分词模块数组
   * @return {array}
   */
  doOptimize(words, modules): SegmentToken[] {
    let result = [...words];
    // 按顺序分别调用各个module来进行分词，各个module仅对没有识别类型的单词进行分词
    modules.forEach(module => {
      result = module.doOptimize(result);
    });
    return result;
  }
}
