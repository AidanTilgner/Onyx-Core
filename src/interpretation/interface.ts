import { Interface } from "docs/interfaces";
import { MetaData } from "./module/index.d";
import { initModel, trainModel, testModel } from "./module/nlp";
import {
  getIntent,
  getAction,
  getIntentAndAction,
  getResponse,
} from "./module/nlp/utils";
import {
  getNLUData,
  unstable_getNLUDataWithoutSession,
} from "./module/nlp/nlu";

class InterpretationInterface extends Interface {
  private initModel: typeof initModel = initModel;
  private trainModel: typeof trainModel = trainModel;
  private testModel: typeof testModel = testModel;
  public getIntent: typeof getIntent = getIntent;
  public getAction: typeof getAction = getAction;
  public getIntentAndAction: typeof getIntentAndAction = getIntentAndAction;
  public getResponse: typeof getResponse = getResponse;
  public getNLUData: typeof getNLUData = getNLUData;
  public getNLUDataWithoutSession: typeof unstable_getNLUDataWithoutSession =
    unstable_getNLUDataWithoutSession;

  constructor() {
    super("Interpretation");
  }

  public async initNLU() {
    await this.initModel();
    await this.trainModel();
    await this.testModel();
  }
}

export default InterpretationInterface;
