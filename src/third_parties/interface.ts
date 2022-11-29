import { Interface } from "docs/interfaces";
import weather from "./module/apis/openweather";

class ThirdPartiesInterface extends Interface {
  constructor() {
    super("ThirdParties");
  }

  public weather = weather;
}

export default ThirdPartiesInterface;
