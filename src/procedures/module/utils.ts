import { getProcedure } from "./index";

export const checkProcedureExists = (procedureName: string) => {
  return !!getProcedure(procedureName);
};
