// @flow
import Module from './BaseModule';
import type { SegmentToken, TokenStartPosition } from './type';


// 协议URL头
const PROTOTAL = ['http://', 'https://', 'ftp://', 'news://', 'telnet://'];
// 协议头最小长度
let MIN_PROTOTAL_LEN = 100;
for (var i in PROTOTAL) {
  if (PROTOTAL[i].length < MIN_PROTOTAL_LEN) {
    MIN_PROTOTAL_LEN = PROTOTAL[i].length;
  }
}
// 允许出现在URL中的字符
const _URLCHAR = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '!',
  '#',
  '$',
  '%',
  '&',
  '‘',
  '(',
  ')',
  '*',
  '+',
  ',',
  '-',
  '.',
  '/',
  ':',
  ';',
  '=',
  '?',
  '@',
  '[',
  '\\',
  ']',
  '^',
  '_',
  '`',
  '|',
  '~',
];
const URLCHAR = {};
for (var i in _URLCHAR) {
  URLCHAR[_URLCHAR[i]] = 1;
}

export default class URLTokenizer extends Module {
  type = 'tokenizer';
  split(words: Array<SegmentToken>): Array<SegmentToken> {
    const POSTAG = this.segment.POSTAG;
    const ret = [];
    for (var i = 0, word; (word = words[i]); i++) {
      if (word.p > 0) {
        ret.push(word);
        continue;
      }
      // 仅对未识别的词进行匹配
      const urlinfo = URLTokenizer.matchURL(word.w);
      if (urlinfo.length < 1) {
        ret.push(word);
        continue;
      }
      // 分离出URL
      let lastc = 0;
      for (var ui = 0, url; (url = urlinfo[ui]); ui++) {
        if (url.c > lastc) {
          ret.push({ w: word.w.substr(lastc, url.c - lastc) });
        }
        ret.push({ w: url.w, p: POSTAG.URL });
        lastc = url.c + url.w.length;
      }
      const lasturl = urlinfo[urlinfo.length - 1];
      if (lasturl.c + lasturl.w.length < word.w.length) {
        ret.push({ w: word.w.substr(lasturl.c + lasturl.w.length) });
      }
    }
    // debug(ret);
    return ret;
  }
  
  /**
   * 匹配包含的网址，返回相关信息
   *
   * @param {string} text 文本
   * @param {int} cur 开始位置
   * @return {array}  返回格式   {w: '网址', c: 开始位置}
   */
  static matchURL(text: string, cur: number): Array<TokenStartPosition> {
    if (isNaN(cur)) cur = 0;
    const ret = [];
    let s = false;
    while (cur < text.length) {
      // 判断是否为 http:// 之类的文本开头
      if (s === false && cur < text.length - MIN_PROTOTAL_LEN) {
        for (var i = 0, prot; (prot = PROTOTAL[i]); i++) {
          if (text.substr(cur, prot.length) == prot) {
            s = cur;
            cur += prot.length - 1;
            break;
          }
        }
      } else if (s !== false && !(text.charAt(cur) in URLCHAR)) {
        // 如果以http://之类开头，遇到了非URL字符，则结束
        ret.push({
          w: text.substr(s, cur - s),
          c: s,
        });
        s = false;
      }
      cur++;
    }
    // 检查剩余部分
    if (s !== false) {
      ret.push({
        w: text.substr(s, cur - s),
        c: s,
      });
    }
  
    return ret;
  }
}
