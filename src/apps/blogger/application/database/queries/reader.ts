import { database, entities } from "../index";

export const createExampleReader = async (info: {
  name: string;
  description: string;
  occupation: string;
}) => {
  const { name, description, occupation } = info;
  const reader = new entities.ExampleReader();
  reader.name = name;
  reader.description = description;
  reader.occupation = occupation;
  return database.manager.save(reader);
};

export const getExampleReader = async (id: number) => {
  return database.manager.findOne(entities.ExampleReader, {
    where: { id },
  });
};

export const getExampleReaders = async () => {
  return database.manager.find(entities.ExampleReader);
};

export const updateExampleReader = async (
  id: number,
  info: {
    name: string;
    description: string;
    occupation: string;
  }
) => {
  const { name, description, occupation } = info;
  const reader = await getExampleReader(id);
  if (reader) {
    reader.name = name;
    reader.description = description;
    reader.occupation = occupation;
    return database.manager.save(reader);
  }
  return null;
};

export const deleteExampleReader = async (id: number) => {
  const reader = await getExampleReader(id);
  if (reader) {
    return database.manager.remove(reader);
  }
  return null;
};

export const getExampleReaderByName = async (name: string) => {
  return database.manager.findOne(entities.ExampleReader, { where: { name } });
};
