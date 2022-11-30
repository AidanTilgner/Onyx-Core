import prettier from "prettier";

export const formatCode = (code: string) => {
  return prettier.format(code);
};

export const formatJSON = (json: string) => {
  return prettier.format(json, { parser: "json" });
};
