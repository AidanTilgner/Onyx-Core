import { Entity } from "../index.d";
import { NLUResponse } from "../index.d";

export const extractAndAddSpecialEntities = (nlu: NLUResponse) => {
  const matches: Entity[] = [];
  entitiesToExtract.forEach((entity) => {
    entity.regex.forEach((regex) => {
      const match = regex.exec(nlu.initial_input);
      if (match) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          len: match[0].length,
          accuracy: 1,
          sourceText: match[0],
          utteranceText: match[0],
          entity: entity.type,
          option: match[1],
          resolution: {},
        });
      }
    });
  });
  nlu.entities = [...nlu.entities, ...matches];
  return nlu;
};

export const findSpecialEntities = (text: string) => {
  const matches: Entity[] = [];
  entitiesToExtract.forEach((entity) => {
    entity.regex.forEach((regex) => {
      const match = regex.exec(text);
      if (match) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          len: match[0].length,
          accuracy: 1,
          sourceText: match[0],
          utteranceText: match[0],
          entity: entity.type,
          option: match[1],
          resolution: {},
        });
      }
    });
  });
  return matches;
};

const entitiesToExtract = [
  {
    type: "name",
    regex: [
      /My name is ([\w\s]+)/g,
      /I am ([\w\s]+)/g,
      /I'm ([\w\s]+)/g,
      /I am called ([\w\s]+)/g,
      /I'm called ([\w\s]+)/g,
      /Call me ([\w\s]+)/g,
    ],
  },
  {
    type: "user_message",
    regex: [
      // my message is ...,
      // say ...
      // tell <name> ...
      // tell <name> to ...
      /My message is ([\w\s]+)/g,
      /Say ([\w\s]+)/g,
      /Tell ([\w\s]+) ([\w\s]+)/g,
      /Tell ([\w\s]+) to ([\w\s]+)/g,
    ],
  },
  {
    type: "note_title",
    regex: [
      // call it...
      // the title is...
      // the title of the note is...
      // the name is...
      /Call it ([\w\s]+)/g,
      /The title is ([\w\s]+)/g,
      /The title of the note is ([\w\s]+)/g,
      /The name is ([\w\s]+)/g,
    ],
  },
  {
    type: "note_content",
    regex: [
      // the content is...
      // the content of the note is...
      // the note is...
      /The content is ([\w\s]+)/g,
      /the content is ([\w\s]+)/g,
      /The content of the note is ([\w\s]+)/g,
      /the content is ([\w\s]+)/g,
      /The note is ([\w\s]+)/g,
      /the note ([\w\s]+)/g,
      /It should say ([\w\s]+)/g,
      /it should say ([\w\s]+)/g,
    ],
  },
  {
    type: "note_similar",
    regex: [
      // similar to ...
      // similar to the note ...
      // similar to the note called ...
      // similar to the note called <title>
      // its similar to ...
      // find a note called ...
      // find a note called <title>
      // find a note like
      /similar to ([\w\s]+)/g,
      /similar to the note ([\w\s]+)/g,
      /similar to the note called ([\w\s]+)/g,
      /similar to the note called ([\w\s]+)/g,
      /its similar to ([\w\s]+)/g,
      /find a note called ([\w\s]+)/g,
      /find a note called ([\w\s]+)/g,
      /find a note like ([\w\s]+)/g,
    ],
  },
];
