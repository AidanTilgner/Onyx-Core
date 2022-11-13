import { initModel, testModel, trainModel, generateMetaData } from "./nlp";

export const startNLP = async () => {
  try {
    console.log("Starting NLP...");
    await initModel();
    await trainModel();
    await testModel();
    generateMetaData();
  } catch (err) {
    console.log(err);
  }
};

export const restartNLP = async () => {
  try {
    console.log("Restarting NLP...");
    await trainModel();
    await testModel();
  } catch (err) {
    console.log(err);
  }
};
