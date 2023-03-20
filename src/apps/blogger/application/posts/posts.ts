import { useOpenAIApi } from "libs/openai";
import { getAuthor } from "../database/queries/author";
import { getPrompt } from "../database/queries/prompt";
import { generateIntialArticlePromptMessages } from "../prompts/prompts";
import { formatTitleIntoFilename } from "../utils/formatting";
import { getExampleReader } from "../database/queries/reader";
import { createPost, getPost, updatePost } from "../database/queries/posts";

export const generateInitialArticle = async (info: {
  title: string;
  description: string;
  importantPoints: string[];
  exampleReader: {
    description: string;
    occupation: string;
  };
  initialPrompt: string;
}) => {
  try {
    const messages = await generateIntialArticlePromptMessages(info);
    const openai = useOpenAIApi();

    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [...messages],
    });

    const { choices } = data;

    const firstChoice = choices[0];

    const { message } = firstChoice;

    return message?.content;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const generatePost = async (info: {
  title: string;
  description: string;
  importantPoints: string[];
  exampleReader: number;
  initialPrompt: number;
  author: number;
}) => {
  try {
    const author = await getAuthor(info.author);
    if (!author) throw new Error("Author not found");
    const initialPrompt = await getPrompt(info.initialPrompt);
    if (!initialPrompt) throw new Error("Initial prompt not found");
    const exampleReader = await getExampleReader(info.exampleReader);
    if (!exampleReader) throw new Error("Example reader not found");

    const generatedPostContent = await generateInitialArticle({
      title: info.title,
      description: info.description,
      importantPoints: info.importantPoints,
      exampleReader: {
        description: exampleReader.description,
        occupation: exampleReader.occupation,
      },
      initialPrompt: initialPrompt.content,
    });

    if (!generatedPostContent) throw new Error("Error generating post content");

    const filename = formatTitleIntoFilename(info.title);

    const post = await createPost({
      title: info.title,
      content: generatedPostContent,
      description: info.description,
      state: "draft",
      author: author.id,
      filename: filename,
    });

    return post;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const finalizePost = async (id: number) => {
  try {
    const post = await getPost(id);

    if (!post) throw new Error("Post not found");

    const updated = await updatePost(post.id, {
      state: "published",
    });

    return updated;
  } catch (err) {
    console.error(err);
    return null;
  }
};
