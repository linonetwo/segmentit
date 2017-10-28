# 中文分词模块

本模块基于 [node-segment](https://github.com/leizongmin/node-segment) 做出 electron、浏览器支持，并准备针对 electron 多线程运行环境进行优化。

## Usage

```javascript
import Segmentit, { useDefault } from 'segmentit';

const segmentit = useDefault(new Segmentit());
const result = segmentit.doSegment('工信处女干事每月经过下属科室都要亲口交代24口交换机等技术性器件的安装工作。');
console.log(result);
```

对于 runkit 环境：

```javascript
const Segmentit = require('segmentit');
const useDefault = require('segmentit').useDefault;
const segmentit = useDefault(new Segmentit());
const result = segmentit.doSegment('工信处女干事每月经过下属科室都要亲口交代24口交换机等技术性器件的安装工作。');
console.log(result);
```

[免费试用，永不收费](https://npm.runkit.com/segmentit)

## License

MIT LICENSED
