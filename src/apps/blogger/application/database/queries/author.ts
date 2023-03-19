import { database, entities } from "..";

export const getAuthors = async () => {
  const authors = await database.getRepository(entities.Author).find();
  return authors;
};

export const getAuthor = async (id: number) => {
  const author = await database.getRepository(entities.Author).findOne({
    where: { id },
  });
  return author;
};

export const createAuthor = async (info: {
  name: string;
  description: string;
}) => {
  const author = await database.getRepository(entities.Author).save({
    name: info.name,
    description: info.description,
  });
  return author;
};

export const updateAuthor = async (
  id: number,
  info: {
    name: string;
    description: string;
  }
) => {
  const author = await database.getRepository(entities.Author).update(id, {
    name: info.name,
    description: info.description,
  });
  return author;
};

export const deleteAuthor = async (id: number) => {
  const author = await database.getRepository(entities.Author).delete(id);
  return author;
};

export const getAuthorPosts = async (id: number) => {
  const author = await database.getRepository(entities.Author).findOne({
    where: { id },
    relations: ["posts"],
  });
  return author?.posts;
};
