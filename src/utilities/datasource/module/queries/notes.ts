import { database, entities } from "../index";
import { getLevensteinDistance, isSimilarEnough } from "../utils/algorithms";
import { Note } from "../models/note";

export const addNote = async (
  title: string,
  content: string,
  userId: number
): Promise<Note | null> => {
  try {
    const newNote = new entities.Note();
    newNote.title = title;
    newNote.content = content;
    await database.manager.save(newNote);
    const user = await database.manager.findOne(entities.User, {
      where: {
        id: userId,
      },
    });
    if (!user) {
      return null;
    }
    user.notes = [...(user.notes || []), newNote];
    await database.manager.save(user);
    return newNote;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getNote = async (
  title: string,
  userId: number
): Promise<Note | null> => {
  try {
    const user = await database.manager.findOne(entities.User, {
      where: {
        id: userId,
      },
      relations: ["notes"],
    });
    if (!user) {
      return null;
    }
    const note = user.notes.find((note) => note.title === title);
    if (!note) {
      return null;
    }
    return note;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getMostSimilarNote = async (
  title: string,
  userId: number
): Promise<Note | null> => {
  try {
    const notes = await getNotes(userId);
    console.log("Getting note similar to:", title);
    if (!notes) {
      return null;
    }
    let minDistance = Infinity;
    let minNote: Note | null = null;
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const distance = getLevensteinDistance(note.title, title);
      if (distance < minDistance) {
        minDistance = distance;
        minNote = note;
      }
    }
    return minNote;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getNotes = async (userId: number): Promise<Note[] | null> => {
  try {
    const user = await database.manager.findOne(entities.User, {
      where: {
        id: userId,
      },
      relations: ["notes"],
    });
    if (!user) {
      return null;
    }
    const notes = user.notes;
    if (!notes) {
      return null;
    }
    return notes;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getNotesSimilarTo = async (
  title: string,
  threshold: number,
  userId: number
): Promise<Note[] | null> => {
  try {
    const notes = await getNotes(userId);
    if (!notes) {
      return null;
    }
    const similarNotes: Note[] = [];
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (isSimilarEnough(note.title, title, threshold)) {
        similarNotes.push(note);
      }
    }
    return similarNotes;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateNote = async (
  title: string,
  content: string,
  userId: number
): Promise<Note | null> => {
  try {
    const note = await getNote(title, userId);
    if (!note) {
      return null;
    }
    note.content = content;
    await database.manager.save(note);
    return note;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const appendNote = async (
  title: string,
  content: string,
  userId: number
): Promise<Note | null> => {
  const note = await getNote(title, userId);
  if (!note) {
    return null;
  }

  note.content += content;
  await database.manager.save(note);
  return note;
};

export const deleteNote = async (
  title: string,
  userId: number
): Promise<boolean> => {
  try {
    const note = await getNote(title, userId);
    if (!note) {
      return false;
    }
    await database.manager.remove(note);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
