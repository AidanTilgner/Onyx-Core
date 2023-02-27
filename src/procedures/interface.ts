import { Interface } from "docs/interfaces";
import { useProcedure, getProcedure } from "./module/index";
import { getProcedureList } from "./module/utils";

class ProceduresInterface extends Interface {
  public useProcedure: typeof useProcedure = useProcedure;
  public getProcedureList: typeof getProcedureList = getProcedureList;
  public getProcedure: typeof getProcedure = getProcedure;
  constructor() {
    super("Procedures");
  }
}

export default ProceduresInterface;
