import { Interface } from "docs/interfaces";
import { useProcedure } from "./module/index";

class ProceduresInterface extends Interface {
  public useProcedure: typeof useProcedure = useProcedure;
  constructor() {
    super("Procedures");
  }
}

export default ProceduresInterface;
