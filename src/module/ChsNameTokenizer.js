// @flow
import { Tokenizer } from './BaseModule';
import type { SegmentToken, TokenStartPosition } from './type';

import { FAMILY_NAME_1, FAMILY_NAME_2, SINGLE_NAME, DOUBLE_NAME_1, DOUBLE_NAME_2 } from './CHS_NAMES';

export default class ChsNameTokenizer extends Tokenizer {
  split(words: Array<SegmentToken>): Array<SegmentToken> {
    const POSTAG = this.segment.POSTAG;
    const ret = [];
    for (var i = 0, word; (word = words[i]); i++) {
      if (word.p > 0) {
        ret.push(word);
        continue;
      }
      // 仅对未识别的词进行匹配
      const nameinfo: TokenStartPosition = ChsNameTokenizer.matchName(word.w);
      if (nameinfo.length < 1) {
        ret.push(word);
        continue;
      }
      // 分离出人名
      let lastc = 0;
      for (var ui = 0, url; (url = nameinfo[ui]); ui++) {
        if (url.c > lastc) {
          ret.push({ w: word.w.substr(lastc, url.c - lastc) });
        }
        ret.push({ w: url.w, p: POSTAG.A_NR });
        lastc = url.c + url.w.length;
      }
      const lastn = nameinfo[nameinfo.length - 1];
      if (lastn.c + lastn.w.length < word.w.length) {
        ret.push({ w: word.w.substr(lastn.c + lastn.w.length) });
      }
    }
    return ret;
  }
  // 匹配包含的人名，并返回相关信息
  static matchName(text: string, startPos: number): Array<TokenStartPosition> {
    let startPosition = 0;
    if (!isNaN(startPos)) startPosition = startPos;
    const result = [];
    while (startPosition < text.length) {
      let name = false;
      // 取两个字，看看在不在复姓表里
      const f2 = text.substr(startPosition, 2);
      if (f2 in FAMILY_NAME_2) {
        const n1 = text.charAt(startPosition + 2);
        const n2 = text.charAt(startPosition + 3);
        // 看看姓后面的字在不在名表里
        if (n1 in DOUBLE_NAME_1 && n2 in DOUBLE_NAME_2) {
          name = f2 + n1 + n2;
        } else if (n1 in SINGLE_NAME) {
          name = f2 + n1 + (n1 === n2 ? n2 : '');
        }
      }
      // 单姓
      const f1 = text.charAt(startPosition);
      if (name === false && f1 in FAMILY_NAME_1) {
        var n1 = text.charAt(startPosition + 1);
        var n2 = text.charAt(startPosition + 2);
        if (n1 in DOUBLE_NAME_1 && n2 in DOUBLE_NAME_2) {
          name = f1 + n1 + n2;
        } else if (n1 in SINGLE_NAME) {
          name = f1 + n1 + (n1 === n2 ? n2 : '');
        }
      }
      // 检查是否匹配成功
      if (name === false) {
        startPosition++;
      } else {
        result.push({ w: name, c: startPosition });
        startPosition += name.length;
      }
    }
    return result;
  }
}
