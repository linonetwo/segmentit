<p>
<a href='https://badge.fury.io/js/segmentit' style='margin: 0 0.5rem;'>
<img src='https://badge.fury.io/js/segmentit.svg' alt='npm version' height='18'/>
</a>

<a href='https://coveralls.io/github/linonetwo/segmentit?branch=master' style='margin: 0 0.5rem;'>
<img src='https://coveralls.io/repos/github/linonetwo/segmentit/badge.svg?branch=master' alt='Coverage Status' height='18'/>
</a>

<a href='https://travis-ci.org/linonetwo/segmentit#' style='margin: 0 0.5rem;'>
<img src='https://api.travis-ci.org/linonetwo/segmentit.svg?branch=master' alt='CI Status' height='18'/>
</a>

<a href='https://img.shields.io/bundlephobia/minzip/segmentit.svg' style='margin: 0 0.5rem;'>
<img src='https://img.shields.io/bundlephobia/minzip/segmentit.svg' alt='Min Zip Size' height='18'/>
</a>
<p>

# 中文分词模块

本模块基于 [node-segment](https://github.com/leizongmin/node-segment) 魔改，增加了 electron、浏览器支持，并准备针对 electron 多线程运行环境进行优化。

之所以要花时间魔改，是因为 `segment` 和 `nodejieba` 虽然在 node 环境下很好用，但根本无法在浏览器和 electron 环境下运行。我把代码重构为 ES2015，并用 babel 插件内联了字典文件，全部载入的话大小是 3.8M，但如果有些字典你并不需要，字典和模块是支持 tree shaking 的（请使用 ESM 模块）。

## Usage

```javascript
import { Segment, useDefault } from 'segmentit';

const segmentit = useDefault(new Segment());
const result = segmentit.doSegment('工信处女干事每月经过下属科室都要亲口交代24口交换机等技术性器件的安装工作。');
console.log(result);
```

对于 runkit 环境：

```javascript
const { Segment, useDefault } = require('segmentit');
const segmentit = useDefault(new Segment());
const result = segmentit.doSegment('工信处女干事每月经过下属科室都要亲口交代24口交换机等技术性器件的安装工作。');
console.log(result);
```

[在 Runkit 上免费试用](https://npm.runkit.com/segmentit)

## 获取词类标注

结巴分词风格的词类标注：

```javascript
// import Segment, { useDefault, cnPOSTag, enPOSTag } from 'segmentit';
const  = require('segmentit').default;
const { Segment, useDefault, cnPOSTag, enPOSTag } = require('segmentit');

const segmentit = useDefault(new Segment());

console.log(segmentit.doSegment('一人得道，鸡犬升天').map(i => `${i.w} <${cnPOSTag(i.p)}> <${enPOSTag(i.p)}>`))
// ↑ ["一人得道 <习语,数词 数语素> <l,m>", "， <标点符号> <w>", "鸡犬升天 <成语> <i>"]
```

## 只使用部分词典或使用自定义词典

useDefault 的具体实现是这样的：

```javascript
// useDefault
import { Segment, modules, dicts, synonyms, stopwords } from 'segmentit';

const segmentit = new Segment();
segmentit.use(modules);
segmentit.loadDict(dicts);
segmentit.loadSynonymDict(synonyms);
segmentit.loadStopwordDict(stopwords);
```

因此你实际上可以 import 所需的那部分字典和模块，然后一个个如下载入。没有 import 的那些字典和模块应该会被 webpack 的 tree shaking 去掉。你也可以这样载入自己定义的字典文件，只需要主要 loadDict 的函数签名是 `(dicts: string | string[]): Segment`。

```javascript
// load custom module and dicts
import {
  Segment,
  ChsNameTokenizer,
  DictOptimizer,
  EmailOptimizer,
  PunctuationTokenizer,
  URLTokenizer,
  ChsNameOptimizer,
  DatetimeOptimizer,
  DictTokenizer,
  ForeignTokenizer,
  SingleTokenizer,
  WildcardTokenizer,
  pangu,
  panguExtend1,
  panguExtend2,
  names,
  wildcard,
  synonym,
  stopword,
} from 'segmentit';

const segmentit = new Segment();

// load them one by one, or by array
segmentit.use(ChsNameTokenizer);
segmentit.loadDict(pangu);
segmentit.loadDict([panguExtend1, panguExtend2]);
segmentit.loadSynonymDict(synonym);
segmentit.loadStopwordDict(stopword);
```

盘古的词典比较复古了，像「软萌萝莉」这种词都是没有的，请有能力的朋友 PR 一下自己的词库。

## 创造自己的分词中间件（Tokenizer）和结果优化器（Optimizer）

### Tokenizer

Tokenizer 是分词时要经过的一个个中间件，类似于 Redux 的 MiddleWare，它的 split 函数接受分词分到一半的 token 数组，返回一个同样格式的 token 数组（这也就是不要对太长的文本分词的原因，不然这个数组会巨爆大）。

例子如下：

```javascript
// @flow
import { Tokenizer } from 'segmentit';
import type { SegmentToken, TokenStartPosition } from 'segmentit';
export default class ChsNameTokenizer extends Tokenizer {
  split(words: Array<SegmentToken>): Array<SegmentToken> {
    // 可以获取到 this.segment 里的各种信息
    const POSTAG = this.segment.POSTAG;
    const TABLE = this.segment.getDict('TABLE');
    // ...
  }
```

### Optimizer

Optimizer 是在分词结束后，发现有些难以利用字典处理的情况，却可以用启发式规则处理时，可以放这些启发式规则的地方，它的 doOptimize 函数同样接收一个 token 数组，返回一个同样格式的 token 数组。

除了 token 数组以外，你还可以自定义余下的参数，比如在下面的例子里，我们会递归调用自己一次，通过第二个参数判断递归深度：

```javascript
// @flow
import { Optimizer } from './BaseModule';
import type { SegmentToken } from './type';
export default class DictOptimizer extends Optimizer {
  doOptimize(words: Array<SegmentToken>, isNotFirst: boolean): Array<SegmentToken> {
    // 可以获取到 this.segment 里的各种信息
    const POSTAG = this.segment.POSTAG;
    const TABLE = this.segment.getDict('TABLE');
    // ...
    // 针对组合数字后无法识别新组合的数字问题，需要重新扫描一次
    return isNotFirst === true ? words : this.doOptimize(words, true);
  }
```

例如目前各种分词工具都没法把「一条红色内裤」中的红色标对词性，但在 segmentit 里我加了个简单的 AdjectiveOptimizer 来处理它：

```javascript
// @flow
// https://github.com/linonetwo/segmentit/blob/master/src/module/AdjectiveOptimizer.js
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
```

## License

MIT LICENSED
