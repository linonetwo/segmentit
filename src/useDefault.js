// @flow
import Segment, { modules, dicts, synonyms, stopwords } from '../src';

export default function useDefault(segmentInstance: Segment): Segment {
  segmentInstance.use(modules);
  segmentInstance.loadDict(dicts);
  segmentInstance.loadSynonymDict(synonyms);
  segmentInstance.loadStopwordDict(stopwords);
  return segmentInstance;
}
