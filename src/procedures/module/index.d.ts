export interface ProcedureArgs {
  [key: string]: any;
}

export interface ProcedureResponse {
  procedure_performed: string;
  procedure_response: string;
  success: boolean;
  data?: any;
  error?: any;
}
export type ProcedureFunction = (
  props: ProcedureArgs,
  ...other: any[]
) => Promise<ProcedureResponse>;
