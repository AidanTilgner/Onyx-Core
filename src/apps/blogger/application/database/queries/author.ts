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
  description?: string;
}) => {
  const author = new entities.Author();
  author.name = info.name;
  author.description = info.description || null;
  await database.manager.save(author);
  return author;
};

export const updateAuthor = async (
  id: number,
  info: {
    name: string;
    description: string;
  }
) => {
  const author = await getAuthor(id);
  if (author) {
    author.name = info.name;
    author.description = info.description;
    await database.manager.save(author);
  }
  return author;
};

export const deleteAuthor = async (id: number) => {
  const author = await getAuthor(id);
  if (author) {
    await database.manager.remove(author);
  }
  return author;
};

export const getAuthorPosts = async (id: number) => {
  const author = await database.getRepository(entities.Author).findOne({
    where: { id },
    relations: ["posts"],
  });
  return author?.posts;
};
