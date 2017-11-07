// @flow
import { Optimizer } from './BaseModule';
import type { SegmentToken } from './type';

import { colors } from './COLORS';

// 把一些错认为名词的词标注为形容词，或者对名词作定语的情况
export default class AdjectiveOptimizer extends Optimizer {
  doOptimize(words: Array<SegmentToken>): Array<SegmentToken> {
    const { POSTAG } = this.segment;
    let index = 0;
    while (index < words.length) {
      const word = words[index];
      const nextword = words[index + 1];
      if (nextword) {
        // 对于<颜色>+<的>，直接判断颜色是形容词（字典里颜色都是名词）
        if (nextword.p === POSTAG.D_U && colors.includes(word.w)) {
          word.p = POSTAG.D_A;
        }
        // 如果是连续的两个名词，前一个是颜色，那这个颜色也是形容词
        if (word.p === POSTAG.D_N && nextword.p === POSTAG.D_N && colors.includes(word.w)) {
          word.p = POSTAG.D_A;
        }
      }
      // 移到下一个单词
      index += 1;
    }
    return words;
  }
}
