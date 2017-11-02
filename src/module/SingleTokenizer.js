// @flow
import Module from './BaseModule';
import type { SegmentToken, TokenStartPosition } from './type';

// 单字切分模块
export default class SingleTokenizer extends Module {
  type = 'tokenizer';
  split(words: Array<SegmentToken>): Array<SegmentToken> {
    const POSTAG = this.segment.POSTAG;
    let ret = [];
    for (var i = 0, word; (word = words[i]); i++) {
      if (word.p) {
        ret.push(word);
      } else {
        // 仅对未识别的词进行匹配
        ret = ret.concat(this.splitSingle(word.w));
      }
    }
    return ret;
  }

  /**
   * 单字切分
   *
   * @param {string} text 要切分的文本
   * @param {int} cur 开始位置
   * @return {array}
   */
  splitSingle(text: string, cur: number): Array<TokenStartPosition> {
    const POSTAG = this.segment.POSTAG;
    if (isNaN(cur)) cur = 0;
    const ret = [];
    while (cur < text.length) {
      ret.push({
        w: text.charAt(cur),
        p: POSTAG.UNK,
      });
      cur++;
    }
    return ret;
  }
}
