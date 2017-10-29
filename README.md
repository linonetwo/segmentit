# 中文分词模块

本模块基于 [node-segment](https://github.com/leizongmin/node-segment) 魔改，增加了 electron、浏览器支持，并准备针对 electron 多线程运行环境进行优化。

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
