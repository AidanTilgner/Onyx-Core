import BloggerInterface from "./blogger/interface";
import OnyxGPTInterface from "./OnyxGPT/interface";

const bloggerInterface = new BloggerInterface();
const onyxGPTInterface = new OnyxGPTInterface();

export const initializeApps = async () => {
  // * Init Blogger
  await bloggerInterface.initializeBloggerDB();

  // * Init Onyx-GPT
  await onyxGPTInterface.initializeGPTDB();
};
