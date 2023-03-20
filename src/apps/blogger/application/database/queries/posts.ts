import { database, entities } from "../index";
import { Tag } from "../models/tag";
import { getAuthor } from "./author";
import { getTag } from "./tags";
import { Post, PostStates } from "../models/post";

export const getPosts = async () => {
  return await database.manager.find(entities.Post);
};

export const getPost = async (id: number) => {
  return await database.manager.findOne(entities.Post, {
    where: {
      id,
    },
  });
};

export const createPost = async (pst: {
  title: string;
  content: string;
  description: string;
  author: number;
  filename: string;
  state: PostStates;
}) => {
  const post = new entities.Post();
  if (!pst.title || !pst.content || !pst.description || !pst.author) {
    throw new Error("Missing required fields");
  }
  post.title = pst.title;
  post.content = pst.content;
  post.description = pst.description;
  const foundAuther = await getAuthor(pst.author);
  if (!foundAuther) {
    throw new Error("Author not found");
  }
  post.author = foundAuther;
  post.filename = pst.filename;
  post.state = pst.state;
  return await database.manager.save(post);
};

export const addTagToPost = async (postId: number, tagId: number) => {
  const post = await getPost(postId);
  const tag = await getTag(tagId);
  if (post && tag) {
    post.tags.push(tag);
    return await database.manager.save(post);
  }
  return null;
};

export const addTagsToPost = async (postId: number, tagIds: number[]) => {
  const post = await getPost(postId);
  const tags = await Promise.all(tagIds.map((id) => getTag(id)));
  const filteredTags = [...tags].filter(
    (t): t is Tag => t !== null && t !== undefined
  );
  if (post && tags) {
    post.tags = [...post.tags, ...filteredTags];
    return await database.manager.save(post);
  }
  return null;
};

export const removeTagFromPost = async (postId: number, tagId: number) => {
  const post = await getPost(postId);
  const tag = await getTag(tagId);
  if (post && tag) {
    post.tags = post.tags.filter((t) => t.id !== tag.id);
    return await database.manager.save(post);
  }
  return null;
};

export const removeTagsFromPost = async (postId: number, tagIds: number[]) => {
  const post = await getPost(postId);
  const tags = await Promise.all(tagIds.map((id) => getTag(id)));
  const filteredTags = [...tags].filter(
    (t): t is Tag => t !== null && t !== undefined
  );
  if (post && tags) {
    post.tags = post.tags.filter((t) => !filteredTags.includes(t));
    return await database.manager.save(post);
  }
  return null;
};

export const updatePost = async (id: number, updates: Partial<Post>) => {
  const post = await getPost(id);
  if (post) {
    post.title = updates.title || post.title;
    post.content = updates.content || post.content;
    post.description = updates.description || post.description;
    post.filename = updates.filename || post.filename;
    return await database.manager.save(post);
  }

  return null;
};

export const deletePost = async (id: number) => {
  const post = await getPost(id);
  if (post) {
    return await database.manager.remove(post);
  }
  return null;
};

export const getTagsByPost = async (id: number) => {
  const post = await database.manager.findOne(entities.Post, {
    where: {
      id,
    },
    relations: ["tags"],
  });
  if (post) {
    return post.tags;
  }
  return null;
};
