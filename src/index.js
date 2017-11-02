// @flow
import Segment from './Segment';
import useDefault from './useDefault';

export default Segment;
export { useDefault };

export { POSTAG, getPOSTagTranslator, cnPOSTag, enPOSTag } from './POSTAG';
export {
  modules,
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
} from './knowledge';
