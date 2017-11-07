/** @flow */

import assert from 'assert';
import Segmentit, { useDefault, cnPOSTag, enPOSTag } from '../src';

let segmentit = null;
let toPOS = null;
let equal = null;
describe('给出词类的中文解释', () => {
  it('init', () => {
    segmentit = useDefault(new Segmentit());
    toPOS = arr => arr.map(w => cnPOSTag(w.p));
    equal = (a, b) => {
      const aString = toPOS(segmentit.doSegment(a));
      assert.equal(
        aString.toString('\t'),
        b.toString('\t'),
        `${a} should be ${JSON.stringify(b)} but is ${JSON.stringify(aString)}`,
      );
    };
  });

  it('给出词类的中文解释', () => {
    equal('因为李三买了一张三角桌子', ['连词 连语素', '人名', '动词 动语素', '助词 助语素', '数量词', '数词 数语素', '名词 名语素']);
  });
});

describe('给出词类的中文解释', () => {
  it('init', () => {
    segmentit = useDefault(new Segmentit());
    toPOS = arr => arr.map(w => enPOSTag(w.p));
    equal = (a, b) => {
      const aString = toPOS(segmentit.doSegment(a));
      assert.equal(
        aString.toString('\t'),
        b.toString('\t'),
        `${a} should be ${JSON.stringify(b)} but is ${JSON.stringify(aString)}`,
      );
    };
  });
  it('给出结巴风格词类标注', () => {
    equal('陈晨和林迪是好朋友', ['nr', 'c', 'nr', 'v', 'a', 'n']);
  });
  it('正确标注颜色的词类', () => {
    equal('一条红色内裤', ['mq', 'a', 'n']);
    equal('一条碧绿的内裤', ['mq', 'a', 'u', 'n']);
    equal('你头顶碧绿的草原', ['r', 'n', 'a', 'u', 'n']);
  });
  it('在外文偏正短语中正确标注颜色的词类', () => {
    equal('一条红色CK内裤', ['mq', 'a', 'nx', 'n']);
  });
  it('正确标注名词性定语', () => {
    equal('一只政府的走狗', ['m', 'd', 'n', 'u', 'n']);
  });
});
