import BloggerInterface from "./blogger/interface";

const bloggerInterface = new BloggerInterface();

export const initializeApps = async () => {
  // * Init Blogger
  await bloggerInterface.initializeBloggerDB();
};
