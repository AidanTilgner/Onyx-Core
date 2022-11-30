import { initModel, testModel, trainModel } from "./nlp";
import { generateMetaData } from "./docs";

export const startNLP = async () => {
  try {
    console.info("Starting NLP...");
    await initModel();
    await trainModel();
    await testModel();
  } catch (err) {
    console.error(err);
  }
};

export const restartNLP = async () => {
  try {
    console.info("Restarting NLP...");
    await trainModel();
    await testModel();
  } catch (err) {
    console.error(err);
  }
};
