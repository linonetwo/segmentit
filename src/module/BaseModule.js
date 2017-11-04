// @flow
import Segment from '../';

export class Module {
  type: 'optimizer' | 'tokenizer';
  constructor(segment: Segment) {
    this.segment = segment;
  }
}

export class Tokenizer extends Module {
  type = 'tokenizer';
}

export class Optimizer extends Module {
  type = 'optimizer';
}
