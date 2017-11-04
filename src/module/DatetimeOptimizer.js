// @flow
import { Optimizer } from './BaseModule';
import type { SegmentToken } from './type';

// 日期时间常见组合
const DATETIME_WORDS = ['世纪', '年', '年份', '年度', '月', '月份', '月度', '日', '号', '时', '点', '点钟', '分', '分钟', '秒', '毫秒'];
const DATETIME = {};
// eslint-disable-next-line
for (const i in DATETIME_WORDS) {
  DATETIME[DATETIME_WORDS[i]] = DATETIME_WORDS[i].length;
}

export default class DatetimeOptimizer extends Optimizer {
  /**
   * 日期时间优化
   *
   * @param {array} words 单词数组
   * @param {bool} isNotFirst 是否为管理器调用的
   * @return {array}
   */
  doOptimize(words: Array<SegmentToken>, isNotFirst: boolean): Array<SegmentToken> {
    if (typeof isNotFirst === 'undefined') {
      isNotFirst = false;
    }
    // 合并相邻的能组成一个单词的两个词
    const TABLE = this.segment.getDict('TABLE');
    const POSTAG = this.segment.POSTAG;

    let i = 0;
    let ie = words.length - 1;
    while (i < ie) {
      var w1 = words[i];
      var w2 = words[i + 1];
      // debug(w1.w + ', ' + w2.w);

      if ((w1.p & POSTAG.A_M) > 0) {
        // =========================================
        // 日期时间组合   数字 + 日期单位，如 “2005年"
        if (w2.w in DATETIME) {
          let nw = w1.w + w2.w;
          let len = 2;
          // 继续搜索后面连续的日期时间描述，必须符合  数字 + 日期单位
          while (true) {
            var w1 = words[i + len];
            var w2 = words[i + len + 1];
            if (w1 && w2 && (w1.p & POSTAG.A_M) > 0 && w2.w in DATETIME) {
              len += 2;
              nw += w1.w + w2.w;
            } else {
              break;
            }
          }
          words.splice(i, len, {
            w: nw,
            p: POSTAG.D_T,
          });
          ie -= len - 1;
          continue;
        }
        // =========================================
      }

      // 移到下一个词
      i++;
    }

    return words;
  }
}
