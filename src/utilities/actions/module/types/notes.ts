import { ActionResponse, ActionArgs } from "../index";
import ActionsInterfacer from "utilities/actions/interfacer";

const interfacer = new ActionsInterfacer();
const { peopleInterface, datasourceInterface } = interfacer;

export const addUserNote = async (
  props: ActionArgs
): Promise<ActionResponse> => {
  try {
    const { note_title, note_content, user_id } = props;

    const note = await datasourceInterface
      .useQueries()
      .note.addNote(note_title, note_content, user_id);

    return {
      success: true,
      action_response: "Successfully added user note.",
      action_performed: "notes.add_user_note",
      data: note,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      action_response: "Failed to add user note.",
      action_performed: "notes.add_user_note",
      data: null,
    };
  }
};

export const getUserNotes = async (
  props: ActionArgs
): Promise<ActionResponse> => {
  try {
    const { user_id } = props;

    const notes = await datasourceInterface.useQueries().note.getNotes(user_id);

    const response =
      notes
        ?.map((note) => {
          return `Title: ${note.title}\nContent: ${note.content}`;
        })
        .join("\n\n") || "No notes found.";

    return {
      success: true,
      action_response: response,
      action_performed: "notes.get_user_notes",
      data: notes,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      action_response: "Failed to retrieve user notes.",
      action_performed: "notes.get_user_notes",
      data: null,
    };
  }
};

export const getMostSimilarUserNote = async (
  props: ActionArgs
): Promise<ActionResponse> => {
  try {
    const { note_similar, user_id } = props;

    const note = await datasourceInterface
      .useQueries()
      .note.getMostSimilarNote(note_similar, user_id);

    const response = note
      ? `Title: ${note.title}\nContent: ${note.content}`
      : "No similar notes found.";

    return {
      success: true,
      action_response: response,
      action_performed: "notes.get_most_similar_user_note",
      data: note,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      action_response: "Failed to retrieve most similar user note.",
      action_performed: "notes.get_most_similar_user_note",
      data: null,
    };
  }
};

export default {
  get_user_notes: getUserNotes,
  add_user_note: addUserNote,
  get_most_similar_user_note: getMostSimilarUserNote,
};
