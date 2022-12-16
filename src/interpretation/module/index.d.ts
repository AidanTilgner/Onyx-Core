export type TextToIntent = {
  text: string;
  intent: string;
  language: string;
}[];

export type IntentToAction = {
  [key: string]: {
    [key: string]: {
      action: string;
    };
  };
};

export type Entity = {
  start: number;
  end: number;
  len: number;
  accuracy: number;
  sourceText: string;
  utteranceText: string;
  entity: string;
  option: string;
  resolution: {
    value?: string | number;
    type?: string;
    strValue?: string;
    subtype?: string;
    unit?: string;
    localUnit?: string;
    timex?: string;
    date?: string;
    strPastValue?: string;
    strFutureValue?: string;
    pastDate?: string;
    futureDate?: string;
    strPastStartValue?: string;
    strPastEndValue?: string;
    strFutureStartValue?: string;
    strFutureEndValue?: string;
    futureStartDate?: string;
    futureEndDate?: string;
  };
};

export type MetaData = {
  intent: string;
  locale: string;
  utterance: string;
  languageGuessed: false;
  localeIso2: string;
  language: string;
  nluAnswer: { classifications: Object[] };
  classifications: [{ intent: string; score: number }];
  score: number;
  domain: string;
  sourceEntities: [
    {
      start: number;
      end: number;
      resolution: Object;
      text: string;
      typeName: string;
    }
  ];
  entities: Entity[];
  answers: string[];
  actions: string[];
  sentiment: {
    score: number;
    numWords: number;
    numHits: number;
    average: number;
    type: string;
    locale: string;
    vote: string;
  };
};

export interface NLUResponse {
  intents: string[];
  actions: string[];
  nlu_response: string;
  responses: string[];
  entities: Entity[];
  classifications: { intent: string; score: number }[];
  custom_entities: { [action: string]: string | number };
  initial_input: string;
  split_input: string[];
  initial_actions: string[];
  metaData: MetaData[];
}

export interface ActionResponse {
  action_performed: string;
  action_response: string;
  success: boolean;
  data?: any;
  error?: any;
}
