// @flow
import Segment from '../';

export default class Module {
  type: 'optimizer' | 'tokenizer';
  constructor(segment: Segment) {
    this.segment = segment;
  }
}
