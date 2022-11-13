import { Interface } from "docs/interfaces";
import { thirdPartyApi } from "./module/index";

class ThirdPartiesInterface extends Interface {
  public thirdPartyApi: typeof thirdPartyApi = thirdPartyApi;

  constructor() {
    super();
  }
}

export default ThirdPartiesInterface;
