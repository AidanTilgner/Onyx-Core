import { Interface } from "docs/interfaces";
import { initializeDB } from "./application/database";

class OnyxGPTInterface extends Interface {
  constructor() {
    super("Onyx-GPT");
  }

  public initializeGPTDB = async () => {
    return await initializeDB();
  };
}

export default OnyxGPTInterface;
