import Note from "../models/note";
import {
  getLevensteinDistance,
  isSimilarEnough,
} from "people/module/utils/algorithms";

export const addNote = async (
  title: string,
  content: string,
  userId: number
): Promise<Note | null> => {
  try {
    const newNote = await Note.create({
      title: title,
      content: content,
      userId: userId,
    });
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
    const note = await Note.findOne({
      where: {
        title: title,
        userId: userId,
      },
    });
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
    const notes = await Note.findAll({
      where: {
        userId: userId,
      },
    });
    if (!notes) {
      return null;
    }
    let min = 1000;
    let minNote: Note | null = null;
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const distance = getLevensteinDistance(title, note.title);
      if (distance < min) {
        min = distance;
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
    const notes = await Note.findAll({
      where: {
        userId: userId,
      },
    });
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
    const notes = await Note.findAll({
      where: {
        userId: userId,
      },
    });
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
    const note = await Note.findOne({
      where: {
        title: title,
        userId: userId,
      },
    });
    if (!note) {
      return null;
    }
    note.content = content;
    await note.save();
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
  await note.save();
  return note;
};

export const deleteNote = async (
  title: string,
  userId: number
): Promise<boolean> => {
  try {
    const note = await Note.findOne({
      where: {
        title: title,
        userId: userId,
      },
    });
    if (!note) {
      return false;
    }
    await note.destroy();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
