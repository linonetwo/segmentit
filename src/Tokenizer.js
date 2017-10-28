// @flow

/**
 * 分词模块管理器
 *
 * @author 老雷<leizongmin@gmail.com>
 */

/**
 * 分词模块管理器
*
* @param {Segment} 分词接口
*/
const Tokenizer = module.exports = function (segment) {
  this.segment = segment;
};

/**
 * 对一段文本进行分词
 *
 * @param {string} text 文本
 * @param {array} modules 分词模块数组
 * @return {array}
 */
Tokenizer.prototype.split = function (text, modules) {
  if (modules.length < 1) {
    throw Error('No tokenizer module!');
  } else {
    // 按顺序分别调用各个module来进行分词 ： 各个module仅对没有识别类型的单词进行分词
    let ret = [{ w: text }];
    modules.forEach((module) => {
      ret = module.split(ret);
    });
    return ret;
  }
};
