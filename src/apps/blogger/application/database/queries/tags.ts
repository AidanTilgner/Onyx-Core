import { database, entities } from "../index";

export const getTags = async () => {
  return await database.manager.find(entities.Tag);
};

export const getTag = async (id: number) => {
  return await database.manager.findOne(entities.Tag, {
    where: {
      id,
    },
  });
};

export const createTag = async (name: string, description: string) => {
  const tag = new entities.Tag();
  tag.name = name;
  tag.description = description;
  return await database.manager.save(tag);
};

export const updateTag = async (
  id: number,
  update: {
    name: string;
    description: string;
  }
) => {
  const tag = await getTag(id);
  if (tag) {
    tag.name = update.name;
    tag.description = update.description;
    return await database.manager.save(tag);
  }
  return null;
};

export const deleteTag = async (id: number) => {
  const tag = await getTag(id);
  if (tag) {
    return await database.manager.remove(tag);
  }
  return null;
};

export const getPostsByTag = async (id: number) => {
  const tag = await database.manager.findOne(entities.Tag, {
    where: {
      id,
    },
    relations: ["posts"],
  });
  if (tag) {
    return tag.posts;
  }
  return null;
};
