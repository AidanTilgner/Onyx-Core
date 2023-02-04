import { ActionResponse, ActionArgs } from "../index";
import ActionsInterfacer from "actions/interfacer";

const people = new ActionsInterfacer().peopleInterface;

export const addUserNote = async (
  props: ActionArgs
): Promise<ActionResponse> => {
  try {
    const { title, content, userId } = props;

    const note = await people.dbQueries.noteQueries.addNote(
      title,
      content,
      userId
    );

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
