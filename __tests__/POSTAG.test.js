/** @flow */

import assert from 'assert';
import Segment, { useDefault, cnPOSTag, enPOSTag } from '../src';

describe('词类测试', () => {
  let segment = null;

  it('init', () => {
    segment = useDefault(new Segment());
  });

  it('中文词类标注', () => {
    const toPOS = arr => arr.map(w => cnPOSTag(w.p));
    const equal = (a, b) => {
      const aString = toPOS(segment.doSegment(a));
      assert.equal(aString.toString('\t'), b.toString('\t'));
    };

    equal('因为李三买了一张三角桌子', ['连词 连语素', '人名', '动词 动语素', '助词 助语素', '数量词', '数词 数语素', '名词 名语素']);
  });

  it('结巴风格词类标注', () => {
    const toPOS = arr => arr.map(w => enPOSTag(w.p));
    const equal = (a, b) => {
      const aString = toPOS(segment.doSegment(a));
      assert.equal(aString.toString('\t'), b.toString('\t'));
    };

    equal('陈晨和林迪是好朋友', ['nr', 'c', 'nr', 'v', 'a', 'n']);
  });
});
