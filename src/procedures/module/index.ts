import nluProcedures from "./defs/nlu";
import triggerProcedures from "./defs/triggers";

const procedures = {
  ...nluProcedures,
  ...triggerProcedures,
};

export const useProcedure = async (procedureName: string, ...args: any[]) => {
  const procedure = procedures[procedureName];
  if (!procedure) {
    console.error(`Procedure ${procedureName} not found`);
    return null;
  }
  return await procedure(...args);
};

export const getProcedure = (procedureName: string) => {
  return procedures[procedureName];
};

export default procedures;
