import { getProcedure, procedures } from "./index";

export const checkProcedureExists = (procedureName: string) => {
  return !!getProcedure(procedureName);
};

export const getProcedureList = () => {
  return Object.keys(procedures);
};
