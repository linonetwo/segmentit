// @flow
import Segment from './Segment';

import {
  modules,
  Module,
  Tokenizer,
  Optimizer,
  CHS_NAMES,
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
} from './module';

import POSTAG, { getPOSTagTranslator, cnPOSTag, enPOSTag } from './POSTAG';

import {
  pangu,
  panguExtend1,
  panguExtend2,
  names,
  wildcard,
  synonym,
  stopword,
  dicts,
  synonyms,
  stopwords,
} from './knowledge';

export type { SegmentToken, TokenStartPosition } from './module';

export function useDefault(segmentInstance: Segment): Segment {
  segmentInstance.use(modules);
  segmentInstance.loadDict(dicts);
  segmentInstance.loadSynonymDict(synonyms);
  segmentInstance.loadStopwordDict(stopwords);
  return segmentInstance;
}

export {
  modules,
  Module,
  Tokenizer,
  Optimizer,
  CHS_NAMES,
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
};

export {
  POSTAG, getPOSTagTranslator, cnPOSTag, enPOSTag,
};

export {
  pangu,
  panguExtend1,
  panguExtend2,
  names,
  wildcard,
  synonym,
  stopword,
  dicts,
  synonyms,
  stopwords,
};

export default Segment;
