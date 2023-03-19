import { Interface } from "docs/interfaces";
import { initializeDB } from "./application/database";

class BloggerInterface extends Interface {
  constructor() {
    super("Blogger");
  }

  public initializeBloggerDB = async () => {
    return await initializeDB();
  };
}

export default BloggerInterface;
