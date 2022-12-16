import { NLUResponse } from "../index.d";
import { extractAndAddSpecialEntities } from "./entities";
// every nlu prediction should run through a pipeline, to check for and add properties
export const defaultPipeline = (nlu: NLUResponse) => {
  // everything in the original nlu object should be gathered through here, including forms and stuff
  nlu = extractAndAddSpecialEntities(nlu);
  return nlu;
};
