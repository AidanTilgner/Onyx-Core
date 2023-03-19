import { Interface } from "docs/interfaces";
import { writeToLocationBlogPath } from "./module/locations/files";

class OperationsInterface extends Interface {
  public writeToLocationBlogPath = writeToLocationBlogPath;

  constructor() {
    super("Operations");
  }
}

export default OperationsInterface;
