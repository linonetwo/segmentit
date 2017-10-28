// @flow

/**
 * 中文人名识别模块
 *
 * @author 老雷<leizongmin@gmail.com>
 */

const FAMILY_NAME_1 = require('./CHS_NAMES').FAMILY_NAME_1;
const FAMILY_NAME_2 = require('./CHS_NAMES').FAMILY_NAME_2;
const SINGLE_NAME = require('./CHS_NAMES').SINGLE_NAME;
const DOUBLE_NAME_1 = require('./CHS_NAMES').DOUBLE_NAME_1;
const DOUBLE_NAME_2 = require('./CHS_NAMES').DOUBLE_NAME_2;

const debug = console.log;

/** 模块类型 */
exports.type = 'tokenizer';

/**
 * 模块初始化
 *
 * @param {Segment} segment 分词接口
 */
exports.init = function (segment) {
  exports.segment = segment;
};

/**
 * 对未识别的单词进行分词
 *
 * @param {array} words 单词数组
 * @return {array}
 */
exports.split = function (words) {
  const POSTAG = exports.segment.POSTAG;
  const ret = [];
  for (var i = 0, word; word = words[i]; i++) {
    if (word.p > 0) {
      ret.push(word);
      continue;
    }
    // 仅对未识别的词进行匹配
    const nameinfo = matchName(word.w);
    if (nameinfo.length < 1) {
      ret.push(word);
      continue;
    }
    // 分离出人名
    let lastc = 0;
    for (var ui = 0, url; url = nameinfo[ui]; ui++) {
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
};


// ======================================================================
/**
 * 匹配包含的人名，并返回相关信息
 *
 * @param {string} text 文本
 * @param {int} cur 开始位置
 * @return {array}  返回格式   {w: '人名', c: 开始位置}
 */
var matchName = function (text, cur) {
  if (isNaN(cur)) cur = 0;
  const ret = [];
  while (cur < text.length) { // debug('cur=' + cur + ', ' + text.charAt(cur));
    let name = false;
    // 复姓
    const f2 = text.substr(cur, 2);
    if (f2 in FAMILY_NAME_2) {
      var n1 = text.charAt(cur + 2);
      var n2 = text.charAt(cur + 3);
      if (n1 in DOUBLE_NAME_1 && n2 in DOUBLE_NAME_2) {
        name = f2 + n1 + n2;
      } else if (n1 in SINGLE_NAME) {
        name = f2 + n1 + (n1 == n2 ? n2 : '');
      }
    }
    // 单姓
    const f1 = text.charAt(cur);
    if (name === false && f1 in FAMILY_NAME_1) {
      var n1 = text.charAt(cur + 1);
      var n2 = text.charAt(cur + 2);
      if (n1 in DOUBLE_NAME_1 && n2 in DOUBLE_NAME_2) {
        name = f1 + n1 + n2;
      } else if (n1 in SINGLE_NAME) {
        name = f1 + n1 + (n1 == n2 ? n2 : '');
      }
    }
    // 检查是否匹配成功
    if (name === false) {
      cur++;
    } else {
      ret.push({ w: name, c: cur });
      cur += name.length;
    }
  }
  return ret;
};
// debug(matchName('刘德华和李娜娜、司马光、上官飞飞'));
// debug(matchName('李克'));

