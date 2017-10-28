// @flow
import { FAMILY_NAME_1, FAMILY_NAME_2, SINGLE_NAME, DOUBLE_NAME_1, DOUBLE_NAME_2 } from './CHS_NAMES';

/** 模块类型 */
const type = 'optimizer';

/**
 * 模块初始化
 *
 * @param {Segment} segment 分词接口
 */
const init = function(segment) {
  ChsNameOptimizer.segment = segment;
};

/**
 * 人名优化模块
 *
 * @author 老雷<leizongmin@gmail.com>
 * @version 0.1
 */
const ChsNameOptimizer = {

}

/**
 * 对可能是人名的单词进行优化
 *
 * @param {array} words 单词数组
 * @return {array}
 */
ChsNameOptimizer.doOptimize = function(words) {
  const POSTAG = ChsNameOptimizer.segment.POSTAG;
  let i = 0;

  /* 第一遍扫描 */
  while (i < words.length) {
    var word = words[i];
    var nextword = words[i + 1];
    if (nextword) {
      // 如果为  "小|老" + 姓
      if (
        nextword &&
        (word.w == '小' || word.w == '老') &&
        (nextword.w in FAMILY_NAME_1 || nextword.w in FAMILY_NAME_2)
      ) {
        words.splice(i, 2, {
          w: word.w + nextword.w,
          p: POSTAG.A_NR,
        });
        i++;
        continue;
      }

      // 如果是 姓 + 名（2字以内）
      if (
        (word.w in FAMILY_NAME_1 || word.w in FAMILY_NAME_2) &&
        ((nextword.p & POSTAG.A_NR) > 0 && nextword.w.length <= 2)
      ) {
        words.splice(i, 2, {
          w: word.w + nextword.w,
          p: POSTAG.A_NR,
        });
        i++;
        continue;
      }

      // 如果相邻两个均为单字且至少有一个字是未识别的，则尝试判断其是否为人名
      if (!word.p || !nextword.p) {
        if (
          (word.w in SINGLE_NAME && word.w == nextword.w) ||
          (word.w in DOUBLE_NAME_1 && nextword.w in DOUBLE_NAME_2)
        ) {
          words.splice(i, 2, {
            w: word.w + nextword.w,
            p: POSTAG.A_NR,
          });
          // 如果上一个单词可能是一个姓，则合并
          const preword = words[i - 1];
          if (preword && (preword.w in FAMILY_NAME_1 || preword.w in FAMILY_NAME_2)) {
            words.splice(i - 1, 2, {
              w: preword.w + word.w + nextword.w,
              p: POSTAG.A_NR,
            });
          } else {
            i++;
          }
          continue;
        }
      }

      // 如果为 无歧义的姓 + 名（2字以内） 且其中一个未未识别词
      if ((word.w in FAMILY_NAME_1 || word.w in FAMILY_NAME_2) && (!word.p || !nextword.p)) {
        words.splice(i, 2, {
          w: word.w + nextword.w,
          p: POSTAG.A_NR,
        });
      }
    }

    // 移到下一个单词
    i++;
  }

  /* 第二遍扫描 */
  i = 0;
  while (i < words.length) {
    var word = words[i];
    var nextword = words[i + 1];
    if (nextword) {
      // 如果为 姓 + 单字名
      if ((word.w in FAMILY_NAME_1 || word.w in FAMILY_NAME_2) && nextword.w in SINGLE_NAME) {
        words.splice(i, 2, {
          w: word.w + nextword.w,
          p: POSTAG.A_NR,
        });
        i++;
        continue;
      }
    }

    // 移到下一个单词
    i++;
  }

  return words;
};

export { type, init };
export default ChsNameOptimizer;
