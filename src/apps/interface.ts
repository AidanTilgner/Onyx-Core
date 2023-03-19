import { Interface } from "docs/interfaces";
import { initializeApps as initApps } from "./index";

class AppsInterface extends Interface {
  constructor() {
    super("Apps");
  }

  public initializeApps = async () => {
    return await initApps();
  };
}

export default AppsInterface;
