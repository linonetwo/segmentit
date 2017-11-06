// @flow
import { Tokenizer } from './BaseModule';
import type { SegmentToken, TokenStartPosition } from './type';

// 标点符号
let _STOPWORD =
  ' ,.;+-|/\\\'":?<>[]{}=!@#$%^&*()~`' +
  '。，、＇：∶；?‘’“”〝〞ˆˇ﹕︰﹔﹖﹑·¨….¸;！´？！～—ˉ｜‖＂〃｀@﹫¡¿﹏﹋﹌︴々﹟#﹩$﹠&﹪%*﹡﹢﹦' +
  '﹤‐￣¯―﹨ˆ˜﹍﹎+=<­＿_-ˇ~﹉﹊（）〈〉‹›﹛﹜『』〖〗［］《》〔〕{}「」【】︵︷︿︹︽_﹁﹃︻︶︸' +
  '﹀︺︾ˉ﹂﹄︼＋－×÷﹢﹣±／＝≈≡≠∧∨∑∏∪∩∈⊙⌒⊥∥∠∽≌＜＞≤≥≮≯∧∨√﹙﹚[]﹛﹜∫∮∝∞⊙∏' +
  '┌┬┐┏┳┓╒╤╕─│├┼┤┣╋┫╞╪╡━┃└┴┘┗┻┛╘╧╛┄┆┅┇╭─╮┏━┓╔╦╗┈┊│╳│┃┃╠╬╣┉┋╰─╯┗━┛' +
  '╚╩╝╲╱┞┟┠┡┢┦┧┨┩┪╉╊┭┮┯┰┱┲┵┶┷┸╇╈┹┺┽┾┿╀╁╂╃╄╅╆' +
  '○◇□△▽☆●◆■▲▼★♠♥♦♣☼☺◘♀√☻◙♂×▁▂▃▄▅▆▇█⊙◎۞卍卐╱╲▁▏↖↗↑←↔◤◥╲╱▔▕↙↘↓→↕◣◢∷▒░℡™';
_STOPWORD = _STOPWORD.split('');
const STOPWORD = {};
const STOPWORD2 = {};
for (const i in _STOPWORD) {
  if (_STOPWORD[i] === '') continue;
  const len = _STOPWORD[i].length;
  STOPWORD[_STOPWORD[i]] = len;
  if (!STOPWORD2[len]) STOPWORD2[len] = {};
  STOPWORD2[len][_STOPWORD[i]] = len;
}

export default class PunctuationTokenizer extends Tokenizer {
  split(words: Array<SegmentToken>): Array<SegmentToken> {
    const POSTAG = this.segment.POSTAG;
    const ret = [];
    for (var i = 0, word; (word = words[i]); i++) {
      if (word.p > 0) {
        ret.push(word);
        continue;
      }
      // 仅对未识别的词进行匹配
      const stopinfo = PunctuationTokenizer.matchStopword(word.w);
      if (stopinfo.length < 1) {
        ret.push(word);
        continue;
      }
      // 分离出标点符号
      let lastc = 0;
      for (var ui = 0, sw; (sw = stopinfo[ui]); ui++) {
        if (sw.c > lastc) {
          ret.push({ w: word.w.substr(lastc, sw.c - lastc) });
        }
        // 忽略空格
        if (sw.w != ' ') {
          ret.push({ w: sw.w, p: POSTAG.D_W });
        }
        lastc = sw.c + sw.w.length;
      }
      const lastsw = stopinfo[stopinfo.length - 1];
      if (lastsw.c + lastsw.w.length < word.w.length) {
        ret.push({ w: word.w.substr(lastsw.c + lastsw.w.length) });
      }
    }
    return ret;
  }

  /**
   * 匹配包含的标点符号，返回相关信息
   *
   * @param {string} text 文本
   * @param {int} cur 开始位置
   * @return {array}  返回格式   {w: '网址', c: 开始位置}
   */
  static matchStopword(text: string, cur: number): Array<TokenStartPosition> {
    if (isNaN(cur)) cur = 0;
    const ret = [];
    let isMatch = false;
    while (cur < text.length) {
      for (const i in STOPWORD2) {
        var w = text.substr(cur, i);
        if (w in STOPWORD2[i]) {
          ret.push({ w, c: cur });
          isMatch = true;
          break;
        }
      }
      cur += isMatch === false ? 1 : w.length;
      isMatch = false;
    }

    return ret;
  }
}
