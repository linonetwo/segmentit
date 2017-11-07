/** @flow */

import assert from 'assert';
import Segmentit, { useDefault, cnPOSTag, enPOSTag } from '../src';

describe('词类测试', () => {
  let segmentit = null;

  it('init', () => {
    segmentit = useDefault(new Segmentit());
  });

  it('中文词类标注', () => {
    const toPOS = arr => arr.map(w => cnPOSTag(w.p));
    const equal = (a, b) => {
      const aString = toPOS(segmentit.doSegment(a));
      assert.equal(
        aString.toString('\t'),
        b.toString('\t'),
        `${a} should be ${JSON.stringify(b)} but is ${JSON.stringify(aString)}`,
      );
    };

    equal('因为李三买了一张三角桌子', ['连词 连语素', '人名', '动词 动语素', '助词 助语素', '数量词', '数词 数语素', '名词 名语素']);
  });

  it('结巴风格词类标注', () => {
    const toPOS = arr => arr.map(w => enPOSTag(w.p));
    const equal = (a, b) => {
      const aString = toPOS(segmentit.doSegment(a));
      assert.equal(
        aString.toString('\t'),
        b.toString('\t'),
        `${a} should be ${JSON.stringify(b)} but is ${JSON.stringify(aString)}`,
      );
    };

    equal('陈晨和林迪是好朋友', ['nr', 'c', 'nr', 'v', 'a', 'n']);

    equal('一条红色内裤', ['mq', 'a', 'n']);
    equal('一条碧绿的内裤', ['mq', 'a', 'u', 'n']);
    equal('你头顶碧绿的草原', ['r', 'n', 'a', 'u', 'n']);

    equal('一只政府的走狗', ['m', 'd', 'n', 'u', 'n']);
  });
});
