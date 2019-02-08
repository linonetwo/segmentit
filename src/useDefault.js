// @flow
import Segment, {
  modules, dicts, synonyms, stopwords,
} from '.';

export default function useDefault(segmentInstance: Segment): Segment {
  segmentInstance.use(modules);
  segmentInstance.loadDict(dicts);
  segmentInstance.loadSynonymDict(synonyms);
  segmentInstance.loadStopwordDict(stopwords);
  return segmentInstance;
}
