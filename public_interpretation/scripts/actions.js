import { getTrainingData } from "./main.js";
import { setAlert } from "./display.js";
const ActionsList = document.getElementById("actions-list");
const SearchInput = document.getElementById("search-input");
const SearchButton = document.getElementById("search-button");

const state = {
  actionMappings: [],
};

const data = await getTrainingData();
if (data.error) {
  setAlert(data.error, "danger");
}
let intentToActionObject = data.data.intent_to_action;
// intentToActionObject schema:
// {
//     [action: string]: {
//         [subaction: string]: {
//             [type: string | "default"]: string
//         }
//     },
// }
// This is the schema. Now we have to make this into an element structure of lists, and append that to ActionsList.

Object.keys(intentToActionObject).forEach((intent) => {
  const intentElement = document.createElement("ul");
  intentElement.classList.add("action");
  intentElement.innerHTML = `<li class="action__name">${intent}</li>`;
  ActionsList.appendChild(intentElement);
  Object.keys(intentToActionObject[intent]).forEach((subintent) => {
    const subintentElement = document.createElement("ul");
    subintentElement.classList.add("subaction");
    subintentElement.innerHTML = `<li class="subaction__name">${subintent}</li>`;
    intentElement.appendChild(subintentElement);
    Object.keys(intentToActionObject[intent][subintent]).forEach((type) => {
      const typeElement = document.createElement("ul");
      typeElement.classList.add("type");
      typeElement.innerHTML = `<li class="type__name">${type}</li>`;
      subintentElement.appendChild(typeElement);
      const typeValueElement = document.createElement("ul");
      typeValueElement.classList.add("type-value");
      typeValueElement.innerHTML = `<li class="type-value__name">${intentToActionObject[intent][subintent][type]}</li>`;
      typeElement.appendChild(typeValueElement);
      state.actionMappings.push({
        element: typeValueElement,
        action: intentToActionObject[intent][subintent][type],
      });
    });
  });
});

const filterExamples = (e) => {
  const filter = SearchInput.value.toLowerCase();
  const actionElements = document.getElementsByClassName("action");
  const subactionElements =
    document.getElementsByClassName("action__subaction");
  const typeElements = document.getElementsByClassName("action__type");

  Array.from(actionElements).forEach((action) => {
    if (action.innerText.toLowerCase().includes(filter)) {
      action.style.display = "flex";
    } else {
      action.style.display = "none";
    }
  });

  Array.from(subactionElements).forEach((subaction) => {
    if (subaction.innerText.toLowerCase().includes(filter)) {
      subaction.style.display = "flex";
    } else {
      subaction.style.display = "none";
    }
  });

  Array.from(typeElements).forEach((type) => {
    if (type.innerText.toLowerCase().includes(filter)) {
      type.style.display = "flex";
    } else {
      type.style.display = "none";
    }
  });
};

SearchInput.addEventListener("keyup", filterExamples);
SearchButton.addEventListener("click", filterExamples);

const getActionServerActions = async () => {
  try {
    const res = await axios
      .get("/training/actions/supported")
      .then((res) => res.data.actions)
      .catch((err) => {
        console.log(err);
      });
    return res;
  } catch (err) {
    console.log(err);
  }
};

const actionServerActions = await getActionServerActions();

/*
  actionServerActions = {
    [action: string]: {
      [subaction: string]
    }
  }
*/

const flagUnsupportedActions = () => {
  // Go through each action in the state and check if it is in the server actions list. If it isn't, put a span tag in front of it with the class "unsupported".
  state.actionMappings.forEach((actionMapping) => {
    const { action: act, element: actionElement } = actionMapping;
    const [action, subaction = "default"] = act.split(".");
    if (!actionServerActions[action]?.includes(subaction)) {
      const unsupportedElement = document.createElement("span");
      unsupportedElement.classList.add("unsupported");
      unsupportedElement.innerText = "*unsupported action";
      unsupportedElement.title =
        "This action is not currently supported by the Actions server.";
      actionElement.children[0].appendChild(unsupportedElement);
    }
  });
};
flagUnsupportedActions();
