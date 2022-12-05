import { getTrainingData } from "./main.js";
import { setAlert } from "./display.js";
const ExamplesList = document.getElementById("examples-list");
const SearchInput = document.getElementById("search-input");
const SearchButton = document.getElementById("search-button");

const data = await getTrainingData();
if (data.error) {
  setAlert(data.error, "danger");
}

const intentHasAction = (intent) => {
  const [int, subint, type = "default"] = intent.split(".");
  const has = data.data.intent_to_action[int]?.[subint]?.[type];
  return has;
};

data.data.text_to_intent.forEach(({ text, intent, language }) => {
  ExamplesList.innerHTML += `<ul class="example">
        <li class="example__text"><strong>Text:</strong> ${text}</li>
        <li class="example__intent"><strong>Intent:</strong> ${intent}${
    !intentHasAction(intent)
      ? `<span class="check-intent" title="An intent requires a subsequent action to determine a response, this one does not have one.">*Intent does not yet have an action</span>`
      : ""
  }</li>
        <li class="example__language"><strong>Language:</strong> ${language}</li>
    </ul>`;
});

const filterExamples = (e) => {
  const filter = SearchInput.value.toLowerCase();
  const exElements = document.getElementsByClassName("example");

  Array.from(exElements).forEach((ex) => {
    if (ex.innerText.toLowerCase().includes(filter)) {
      ex.style.display = "flex";
    } else {
      ex.style.display = "none";
    }
  });
};

SearchInput.addEventListener("keyup", filterExamples);
SearchButton.addEventListener("click", filterExamples);
