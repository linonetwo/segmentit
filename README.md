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

console.log(segmentit.doSegment('因为李三买了一张三角桌子').map(w => cnPOSTag(w.p)))
// ↑ [ '连词 连语素', '人名', '动词 动语素', '助词 助语素', '数量词', '数词 数语素', '名词 名语素' ]
console.log(segmentit.doSegment('因为李三买了一张三角桌子').map(w => enPOSTag(w.p)))
// ↑ [ 'c', 'nr', 'v', 'u', 'mq', 'm', 'n' ]
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

## License

MIT LICENSED
