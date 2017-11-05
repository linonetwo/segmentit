# 中文分词模块

本模块基于 [node-segment](https://github.com/leizongmin/node-segment) 魔改，增加了 electron、浏览器支持，并准备针对 electron 多线程运行环境进行优化。

之所以要花时间魔改，是因为 ```segment``` 和 ```nodejieba``` 虽然在 node 环境下很好用，但根本无法在浏览器和 electron 环境下运行。我把代码重构为 ES2015，并用 babel 插件内联了字典文件，全部载入的话大小是 5.4M，但如果有些字典你并不需要，字典和模块应该是支持 tree shaking 的。

## Usage

```javascript
import Segmentit, { useDefault } from 'segmentit';

const segmentit = useDefault(new Segmentit());
const result = segmentit.doSegment('工信处女干事每月经过下属科室都要亲口交代24口交换机等技术性器件的安装工作。');
console.log(result);
```

对于 runkit 环境：

```javascript
const Segmentit = require('segmentit').default;
const useDefault = require('segmentit').useDefault;
const segmentit = useDefault(new Segmentit());
const result = segmentit.doSegment('工信处女干事每月经过下属科室都要亲口交代24口交换机等技术性器件的安装工作。');
console.log(result);
```

[免费试用，永不收费](https://npm.runkit.com/segmentit)

## 获取词类标注

结巴分词风格的词类标注：

```javascript
// import Segment, { useDefault, cnPOSTag, enPOSTag } from 'segmentit';
const Segmentit = require('segmentit').default;
const { useDefault, cnPOSTag, enPOSTag } = require('segmentit');

const segmentit = useDefault(new Segmentit());

console.log(segmentit.doSegment('一人得道，鸡犬升天').map(i => `${i.w} <${cnPOSTag(i.p)}> <${enPOSTag(i.p)}>`))
// ↑ ["一人得道 <习语,数词 数语素> <l,m>", "， <标点符号> <w>", "鸡犬升天 <成语> <i>"]
```

## 只使用部分词典或使用自定义词典

useDefault 的具体实现是这样的：

```javascript
// useDefault
import Segment, { modules, dicts, synonyms, stopwords } from 'segmentit';

const segmentit = new Segmentit();
segmentit.use(modules);
segmentit.loadDict(dicts);
segmentit.loadSynonymDict(synonyms);
segmentit.loadStopwordDict(stopwords);
```

因此你实际上可以 import 所需的那部分字典和模块，然后一个个如下载入。没有 import 的那些字典和模块应该会被 webpack 的 tree shaking 去掉。你也可以这样载入自己定义的字典文件，只需要主要 loadDict 的函数签名是 ```(dicts: string | string[]): Segment```。

```javascript
// load custom module and dicts
import Segment, {
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

const segmentit = new Segmentit();

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

## License

MIT LICENSED
