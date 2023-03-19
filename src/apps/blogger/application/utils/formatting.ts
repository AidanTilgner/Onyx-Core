export const formatTitleIntoFilename = (title: string) => {
  // title like "How To Do Thing" -> "how-to-do-thing"
  const formattedTitle = title.toLowerCase().split(" ").join("-");
  return formattedTitle;
};
