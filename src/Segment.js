// @flow
/**
 * 分词器接口
 *
 * @author 老雷<leizongmin@gmail.com>
 * @author 林一二<linonetwo012@gmail.com>
 */

import POSTAG from './POSTAG';
import Tokenizer from './Tokenizer';
import Optimizer from './Optimizer';

/**
 * 创建分词器接口
*/
export default class Segment {
  constructor() {
    this.POSTAG = POSTAG; // 词性
    this.DICT = {}; // 词典表
    this.modules = {
      tokenizer: [], // 分词模块
      optimizer: [], // 优化模块
    };
    this.tokenizer = new Tokenizer(this);
    this.optimizer = new Optimizer(this);
  }

  /**
 * 载入分词模块
 *
 * @param {String|Array|Object} module 模块名称(数组)或模块对象
 * @return {Segment}
 */
  use = (module: Array | Object): Segment => {
    // 传入列表的话就递归调用
    if (Array.isArray(module)) {
      module.forEach(this.use);
    } else {
      // 初始化并注册模块
      this.modules[module.type].push(module.init(this));
    }

    return this;
  };

  /**
 * 载入字典文件
 *
 * @param {String} name 字典文件名
 * @param {String} type 类型
 * @param {Boolean} convertToLower 是否全部转换为小写
 * @return {Segment}
 */
  loadDict = (dict: string | string[], type = 'TABLE', convertToLower: boolean = false): Segment => {
    if (Array.isArray(dict)) {
      dict.forEach(d => this.loadDict(d));
    } else {
      // 初始化词典
      if (!this.DICT[type]) this.DICT[type] = {};
      if (!this.DICT[`${type}2`]) this.DICT[`${type}2`] = {};
      const TABLE = this.DICT[type]; // 词典表  '词' => {属性}
      const TABLE2 = this.DICT[`${type}2`]; // 词典表  '长度' => '词' => 属性
      // 导入数据
      dict
        .split(/\r?\n/)
        .map(line => {
          if (convertToLower) return line.toLowerCase();
          return line;
        })
        .forEach(line => {
          const blocks = line.split('|');
          if (blocks.length > 2) {
            const w = blocks[0].trim();
            const p = Number(blocks[1]);
            const f = Number(blocks[2]);

            // 一定要检查单词是否为空，如果为空会导致Bug
            if (w.length > 0) {
              TABLE[w] = { f, p };
              if (!TABLE2[w.length]) TABLE2[w.length] = {};
              TABLE2[w.length][w] = TABLE[w];
            }
          }
        });
    }

    return this;
  };

  /**
 * 取词典表
 *
 * @param {String} type 类型
 * @return {object}
 */
  getDict = (type: string) => this.DICT[type];

  /**
 * 载入同义词词典
 *
 * @param {Object} dict 字典文件
 */
  loadSynonymDict = (dict: string | string[]): Segment => {
    if (Array.isArray(dict)) {
      dict.forEach(d => this.loadSynonymDict(d));
    } else {
      const type = 'SYNONYM';

      // 初始化词典
      if (!this.DICT[type]) this.DICT[type] = {};
      const TABLE = this.DICT[type]; // 词典表  '同义词' => '标准词'
      // 导入数据
      dict
        .split(/\r?\n/)
        .map(line => line.split(','))
        .forEach(blocks => {
          if (blocks.length > 1) {
            const n1 = blocks[0].trim();
            const n2 = blocks[1].trim();
            TABLE[n1] = n2;
            if (TABLE[n2] === n1) {
              delete TABLE[n2];
            }
          }
        });
    }

    return this;
  };

  /**
 * 载入停止符词典
 *
 * @param {Object} dict 字典文件
 */
  loadStopwordDict = (dict: string | string[]): Segment => {
    if (Array.isArray(dict)) {
      dict.forEach(d => this.loadStopwordDict(d));
    } else {
      const type = 'STOPWORD';

      // 初始化词典
      if (!this.DICT[type]) this.DICT[type] = {};
      const TABLE = this.DICT[type]; // 词典表  '同义词' => '标准词'
      // 导入数据
      dict
        .split(/\r?\n/)
        .map(line => line.trim())
        .forEach(line => {
          if (line) {
            TABLE[line] = true;
          }
        });
    }

    return this;
  };

  /**
 * 开始分词
 *
 * @param {String} text 文本
 * @param {Object} options 选项
 *   - {Boolean} simple 是否仅返回单词内容
 *   - {Boolean} stripPunctuation 去除标点符号
 *   - {Boolean} convertSynonym 转换同义词
 *   - {Boolean} stripStopword 去除停止符
 * @return {Array}
 */
  doSegment = (text, options) => {
    const me = this;
    options = options || {};
    let ret = [];

    // 将文本按照换行符分割成多段，并逐一分词
    text
      .replace(/\r/g, '\n')
      .split(/(\n|\s)+/)
      .forEach(section => {
        var section = section.trim();
        if (section.length < 1) return;
        // ======================================
        // 分词
        let sret = me.tokenizer.split(section, me.modules.tokenizer);

        // 优化
        sret = me.optimizer.doOptimize(sret, me.modules.optimizer);

        // ======================================
        // 连接分词结果
        if (sret.length > 0) ret = ret.concat(sret);
      });

    // 去除标点符号
    if (options.stripPunctuation) {
      ret = ret.filter(item => item.p !== POSTAG.D_W);
    }

    // 转换同义词
    function convertSynonym(list) {
      let count = 0;
      const TABLE = me.getDict('SYNONYM');
      list = list.map(item => {
        if (item.w in TABLE) {
          count++;
          return { w: TABLE[item.w], p: item.p };
        }
        return item;
      });
      return { count, list };
    }
    if (options.convertSynonym) {
      do {
        var result = convertSynonym(ret);
        ret = result.list;
      } while (result.count > 0);
    }

    // 去除停止符
    if (options.stripStopword) {
      const STOPWORD = me.getDict('STOPWORD');
      ret = ret.filter(item => !(item.w in STOPWORD));
    }

    // 仅返回单词内容
    if (options.simple) {
      ret = ret.map(item => item.w);
    }

    return ret;
  };

  /**
 * 将单词数组连接成字符串
 *
 * @param {Array} words 单词数组
 * @return {String}
 */
  toString(words) {
    return words.map(item => item.w).join('');
  }

  /**
 * 根据某个单词或词性来分割单词数组
 *
 * @param {Array} words 单词数组
 * @param {Number|String} s 用于分割的单词或词性
 * @return {Array}
 */
  split(words, s) {
    const ret = [];
    let lasti = 0;
    let i = 0;
    const f = typeof s === 'string' ? 'w' : 'p';

    while (i < words.length) {
      if (words[i][f] == s) {
        if (lasti < i) ret.push(words.slice(lasti, i));
        ret.push(words.slice(i, i + 1));
        i++;
        lasti = i;
      } else {
        i++;
      }
    }
    if (lasti < words.length - 1) {
      ret.push(words.slice(lasti, words.length));
    }

    return ret;
  }

  /**
 * 在单词数组中查找某一个单词或词性所在的位置
 *
 * @param {Array} words 单词数组
 * @param {Number|String} s 要查找的单词或词性
 * @param {Number} cur 开始位置
 * @return {Number} 找不到，返回-1
 */
  indexOf(words, s, cur) {
    cur = isNaN(cur) ? 0 : cur;
    const f = typeof s === 'string' ? 'w' : 'p';

    while (cur < words.length) {
      if (words[cur][f] == s) return cur;
      cur++;
    }

    return -1;
  }
}
