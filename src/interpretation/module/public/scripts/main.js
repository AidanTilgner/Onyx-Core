import { setAlert } from "./display.js";

const links = [
  `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />`,
];

links.forEach((link) => {
  document.head.innerHTML += link;
});

export const getTrainingData = async () => {
  try {
    const trainingData = await axios
      .get("/training/")
      .then((res) => {
        if (res.data.error) {
          setAlert(res.data.error, "danger");
          return null;
        }
        //   setAlert(res.data.message, "success");
        return res.data;
      })
      .catch((err) => {
        console.log(
          "Error fetching training data, check console for more information.:",
          err
        );
        setAlert(
          "Error fetching training data, check console for more information.",
          "danger"
        );
      });
    return trainingData;
  } catch (err) {
    console.log("Error:", err);
    setAlert(
      "Error fetching training data, check console for more information.",
      "danger"
    );
  }
};
