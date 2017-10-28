// @flow
import Segment from './Segment';

export default Segment;

export { POSTAG } from './POSTAG';
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
