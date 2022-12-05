import { setAlert } from "./display.js";
import { getTrainingData } from "./main.js";
const TestingInput = document.getElementById("testing-input");
const TestingSubmit = document.getElementById("testing-submit");
const TestingOutput = document.getElementById("testing-output");
const OutputStage = document.getElementById("output-stage");

const state = {
  input: TestingInput.value,
  intents: [],
  actions: [],
  nlu_response: "",
  responses: [],
  split_input: [],
  currentTooltip: null,
};

(async () => {
  try {
    const training = await getTrainingData();
    if (training.data.error) {
      setAlert(training.data.error, "danger");
      return;
    }
    state.intents = training.data.intents;
  } catch (err) {
    console.log(err);
    setAlert(
      "Error getting training data, check console for more info.",
      "danger"
    );
  }
})();

TestingInput.onkeyup = () => {
  state.input = TestingInput.value;
};

const checkDisplayProperties = () => {
  const OutputProperties = document.querySelectorAll(".output-property");
  const OutputLists = document.querySelectorAll(".output-list");
  OutputProperties.forEach((property) => {
    if (!state[property.dataset.state]) {
      property.style.display = "none";
      return;
    }
    property.style.display = "flex";
  });
  OutputLists.forEach((list) => {
    if (!state[list.dataset.state]?.length) {
      list.style.display = "none";
      return;
    }
    list.style.display = "flex";
  });
};
checkDisplayProperties();

const checkDisplayOutput = () => {
  if (TestingOutput.innerHTML.length > 0) {
    TestingOutput.style.display = "flex";
  } else {
    TestingOutput.style.display = "none";
  }
};
checkDisplayOutput();

const updateModel = async () => {
  try {
    const { trained, message } = await axios
      .post("/training/train")
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        setAlert("There was an error training the model", "danger");
      });

    const trainedbool = !!Number(trained);

    if (trainedbool) {
      setAlert(message, "success");
    }

    console.log("Trained model:", trainedbool);
    return trainedbool;
  } catch (err) {
    console.log(err);
    setAlert("Error updating model, check console for more info.", "danger");
    return false;
  }
};
updateModel();

const getNLUForInput = async () => {
  try {
    const { nlu } = await axios
      .post("/nlu", {
        text: state.input,
      })
      .then((res) => {
        if (res.data.error) {
          setAlert(res.data.error, "danger");
          return;
        }
        return res.data;
      })
      .catch((err) => {
        console.log("Error:", err);
        setAlert(
          "Error getting NLU response, check console for more info.",
          "danger"
        );
      });
    state.intents = nlu.intents;
    state.nlu_response = nlu.nlu_response;
    state.actions = nlu.actions;
    state.responses = nlu.responses;
    state.split_input = nlu.split_input;
    TestingOutput.innerHTML = nlu.nlu_response;

    const currentProperties = document.querySelectorAll(".output-properties");
    currentProperties.forEach((property) => {
      property.remove();
    });

    state.intents.forEach((intent, idx) => {
      const action = state.actions[idx];
      const response = state.responses[idx];
      const input = state.split_input[idx];

      const OutputProperties = document.createElement("div");
      OutputProperties.classList.add("output-properties");
      OutputStage.appendChild(OutputProperties);
      OutputProperties.dataset.input = input;
      OutputProperties.dataset.intent = intent;
      OutputProperties.dataset.action = action;
      OutputProperties.dataset.response = response;

      const InputProperty = document.createElement("div");
      InputProperty.classList.add("output-property");
      InputProperty.dataset.state = "input";
      InputProperty.dataset.property = "input";
      InputProperty.dataset.data = input;
      InputProperty.innerHTML = `<strong>Input</strong>: ${input}`;

      const IntentProperty = document.createElement("div");
      IntentProperty.classList.add("output-property");
      IntentProperty.dataset.state = "intents";
      IntentProperty.dataset.property = "intent";
      IntentProperty.dataset.data = intent;
      IntentProperty.innerHTML = `<strong>Intent</strong>: ${intent}`;

      const ActionProperty = document.createElement("div");
      ActionProperty.classList.add("output-property");
      ActionProperty.dataset.state = "actions";
      ActionProperty.dataset.property = "action";
      ActionProperty.dataset.data = action;
      ActionProperty.innerHTML = `<strong>Action</strong>: ${action}`;

      const ResponseProperty = document.createElement("div");
      ResponseProperty.classList.add("output-property");
      ResponseProperty.dataset.state = "responses";
      ResponseProperty.dataset.property = "response";
      ResponseProperty.dataset.data = response;
      ResponseProperty.innerHTML = `<strong>Response</strong>: ${response}`;

      OutputProperties.appendChild(InputProperty);
      OutputProperties.appendChild(IntentProperty);
      OutputProperties.appendChild(ActionProperty);
      OutputProperties.appendChild(ResponseProperty);

      const IntentIcons = document.createElement("div");
      IntentIcons.classList.add("icons");
      IntentProperty.appendChild(IntentIcons);
      const IntentEdit = document.createElement("i");
      IntentEdit.classList.add("material-symbols-outlined");
      IntentEdit.classList.add("primary");
      IntentEdit.classList.add("edit-intent");
      IntentEdit.title = `Edit intent for ${input}`;
      IntentEdit.innerHTML = "edit";
      IntentIcons.appendChild(IntentEdit);

      const ActionIcons = document.createElement("div");
      ActionIcons.classList.add("icons");
      ActionProperty.appendChild(ActionIcons);
      const ActionEdit = document.createElement("i");
      ActionEdit.classList.add("material-symbols-outlined");
      ActionEdit.classList.add("primary");
      ActionEdit.classList.add("edit-action");
      ActionEdit.title = `Edit action for ${intent}`;
      ActionEdit.innerHTML = "edit";
      ActionIcons.appendChild(ActionEdit);

      const ResponseIcons = document.createElement("div");
      ResponseIcons.classList.add("icons");
      ResponseProperty.appendChild(ResponseIcons);
      const ResponseRemove = document.createElement("i");
      ResponseRemove.classList.add("material-symbols-outlined");
      ResponseRemove.classList.add("danger");
      ResponseRemove.classList.add("remove-response");
      ResponseRemove.title = `Remove response for ${action}`;
      ResponseRemove.innerHTML = "delete";
      const ResponseAdd = document.createElement("i");
      ResponseAdd.classList.add("material-symbols-outlined");
      ResponseAdd.classList.add("primary");
      ResponseAdd.classList.add("add-response");
      ResponseAdd.title = `Add response for ${action}`;
      ResponseAdd.innerHTML = "add";
      ResponseIcons.appendChild(ResponseRemove);
      ResponseIcons.appendChild(ResponseAdd);
    });

    checkDisplayOutput();
    checkDisplayProperties();
    addPropertyEventListeners();
    return nlu;
  } catch (err) {
    console.log("Error:", err);
    setAlert(
      "Error getting NLU response, check console for more info.",
      "danger"
    );
  }
};

const UpdateAndGetNLUForInput = async () => {
  try {
    const trained = await updateModel();

    console.log("Trained 2:", trained);

    if (!trained) {
      setAlert("Model not trained, please train the model", "danger");
      return;
    }

    const { nlu } = await axios
      .post("/nlu", {
        text: state.input,
      })
      .then((res) => {
        if (res.data.error) {
          setAlert(res.data.error, "danger");
          return;
        }
        return res.data;
      })
      .catch((err) => {
        console.log("Error:", err);
        setAlert(
          "Error getting NLU response, check console for more info.",
          "danger"
        );
      });
    state.intents = nlu.intents;
    state.nlu_response = nlu.nlu_response;
    state.actions = nlu.actions;
    state.responses = nlu.responses;
    state.split_input = nlu.split_input;
    TestingOutput.innerHTML = nlu.nlu_response;

    const currentProperties = document.querySelectorAll(".output-properties");
    currentProperties.forEach((property) => {
      property.remove();
    });

    state.intents.forEach((intent, idx) => {
      const action = state.actions[idx];
      const response = state.responses[idx];
      const input = state.split_input[idx];

      const OutputProperties = document.createElement("div");
      OutputProperties.classList.add("output-properties");
      OutputStage.appendChild(OutputProperties);
      OutputProperties.dataset.input = input;
      OutputProperties.dataset.intent = intent;
      OutputProperties.dataset.action = action;
      OutputProperties.dataset.response = response;

      const InputProperty = document.createElement("div");
      InputProperty.classList.add("output-property");
      InputProperty.dataset.state = "input";
      InputProperty.dataset.property = "input";
      InputProperty.dataset.data = input;
      InputProperty.innerHTML = `<strong>Input</strong>: ${input}`;

      const IntentProperty = document.createElement("div");
      IntentProperty.classList.add("output-property");
      IntentProperty.dataset.state = "intents";
      IntentProperty.dataset.property = "intent";
      IntentProperty.dataset.data = intent;
      IntentProperty.innerHTML = `<strong>Intent</strong>: ${intent}`;

      const ActionProperty = document.createElement("div");
      ActionProperty.classList.add("output-property");
      ActionProperty.dataset.state = "actions";
      ActionProperty.dataset.property = "action";
      ActionProperty.dataset.data = action;
      ActionProperty.innerHTML = `<strong>Action</strong>: ${action}`;

      const ResponseProperty = document.createElement("div");
      ResponseProperty.classList.add("output-property");
      ResponseProperty.dataset.state = "responses";
      ResponseProperty.dataset.property = "response";
      ResponseProperty.dataset.data = response;
      ResponseProperty.innerHTML = `<strong>Response</strong>: ${response}`;

      OutputProperties.appendChild(InputProperty);
      OutputProperties.appendChild(IntentProperty);
      OutputProperties.appendChild(ActionProperty);
      OutputProperties.appendChild(ResponseProperty);

      const IntentIcons = document.createElement("div");
      IntentIcons.classList.add("icons");
      IntentProperty.appendChild(IntentIcons);
      const IntentEdit = document.createElement("i");
      IntentEdit.classList.add("material-symbols-outlined");
      IntentEdit.classList.add("primary");
      IntentEdit.classList.add("edit-intent");
      IntentEdit.title = `Edit intent for ${input}`;
      IntentEdit.innerHTML = "edit";
      IntentIcons.appendChild(IntentEdit);

      const ActionIcons = document.createElement("div");
      ActionIcons.classList.add("icons");
      ActionProperty.appendChild(ActionIcons);
      const ActionEdit = document.createElement("i");
      ActionEdit.classList.add("material-symbols-outlined");
      ActionEdit.classList.add("primary");
      ActionEdit.classList.add("edit-action");
      ActionEdit.title = `Edit action for ${intent}`;
      ActionEdit.innerHTML = "edit";
      ActionIcons.appendChild(ActionEdit);

      const ResponseIcons = document.createElement("div");
      ResponseIcons.classList.add("icons");
      ResponseProperty.appendChild(ResponseIcons);
      const ResponseRemove = document.createElement("i");
      ResponseRemove.classList.add("material-symbols-outlined");
      ResponseRemove.classList.add("danger");
      ResponseRemove.classList.add("remove-response");
      ResponseRemove.title = `Remove response for ${action}`;
      ResponseRemove.innerHTML = "delete";
      const ResponseAdd = document.createElement("i");
      ResponseAdd.classList.add("material-symbols-outlined");
      ResponseAdd.classList.add("primary");
      ResponseAdd.classList.add("add-response");
      ResponseAdd.title = `Add response for ${action}`;
      ResponseAdd.innerHTML = "add";
      ResponseIcons.appendChild(ResponseRemove);
      ResponseIcons.appendChild(ResponseAdd);
    });

    checkDisplayOutput();
    checkDisplayProperties();
    addPropertyEventListeners();
    return nlu;
  } catch (err) {
    console.log("Error:", err);
    setAlert(
      "Error getting NLU response, check console for more info.",
      "danger"
    );
  }
};

TestingSubmit.addEventListener("click", getNLUForInput);
// Testing Input should also call getNLUForInput when enter is pressed.
TestingInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    getNLUForInput();
  }
});

const createEditInputGroup = ({
  placeholder = "Enter text",
  value = "",
  buttons,
}) => {
  const EditInputGroup = document.createElement("div");
  EditInputGroup.classList.add("output-edit-property");
  const input = document.createElement("input");
  input.value = value;
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", placeholder);
  input.classList.add("output-edit-property__input");
  EditInputGroup.appendChild(input);
  const icons = document.createElement("div");
  icons.classList.add("output-edit-property__icons");
  buttons.forEach((button) => {
    const icon = document.createElement("i");
    icon.classList.add("material-symbols-outlined");
    icon.classList.add(button.type);
    icon.title = button.title;
    icon.innerHTML = button.icon;
    icon.onclick = button.action;
    icons.appendChild(icon);

    if (button.type === "primary") {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          button.action();
        }
      });
    }
  });
  EditInputGroup.appendChild(icons);

  return {
    EditInputGroup,
    input,
    icons,
  };
};

const handleEditIntentClick = (e) => {
  e.preventDefault();
  const PropertyItem = e.target.closest(".output-property");
  const OutputProperties = PropertyItem.closest(".output-properties");
  const { EditInputGroup, input, icons } = createEditInputGroup({
    placeholder: "Enter the correct intent",
    value: PropertyItem.dataset.data,
    buttons: [
      {
        title: "Cancel",
        icon: "cancel",
        type: "danger",
        action: () => {
          EditInputGroup.remove();
          PropertyItem.style.display = "flex";
        },
      },
      {
        title: "Submit new intent",
        icon: "check",
        type: "primary",
        action: () => {
          const inputText = OutputProperties.dataset.input;
          const confirmed = confirm(
            `Are you sure? This will change the intent to ${input.value} for the text "${inputText}".`
          );
          if (!confirmed) {
            return;
          }
          const { value } = input;
          EditInputGroup.remove();
          PropertyItem.style.display = "flex";
          PropertyItem.dataset.data = value;
          // TestingIntent.innerHTML = `<strong>Intent:</strong> ${value}`;
          // TestingAction.innerHTML = `<strong>Action:</strong> loading...`;
          // TestingResponse.innerHTML = `<strong>Response:</strong> loading...`;
          // TestingResponses.innerHTML = `<p class="output-list-title">Responses:</p><span class="output-list-item">loading...</span>`;

          axios
            .put("/training/intent", {
              text: state.input,
              intent: value,
            })
            .then((res) => {
              if (res.data.error) {
                setAlert(res.data.error, "danger");
                return;
              }
              setAlert(res.data.message, "success");
              UpdateAndGetNLUForInput();
            })
            .catch((err) => {
              console.log("Error:", err);
              setAlert(err.response.data.error, "danger");
            });
        },
      },
    ],
  });
  // Set display none on testing-intent and make EditInputGroup the first child of testing-properties.
  PropertyItem.style.display = "none";
  OutputProperties.insertBefore(EditInputGroup, PropertyItem);
  input.focus();

  // every keypress, search the state.intents for the closests 5 intents by levenshtein distance.
  input.addEventListener("keyup", (e) => {
    const closest = state.intents
      .sort((a, b) => {
        return (
          getLevenshteinDistance(a, e.target.value) -
          getLevenshteinDistance(b, e.target.value)
        );
      })
      .slice(0, 5);
    state.currentTooltip?.remove();
    const tooltip = document.createElement("div");
    state.currentTooltip = tooltip;
    tooltip.classList.add("tooltip");
    tooltip.innerHTML = `<p><strong>Similar Intents:</strong> ${closest
      .map(
        (intent, idx) =>
          `${
            idx ? "," : ""
          } <span class="similar-intent" title="Select this intent">${intent}</span>`
      )
      .join("")}</p>`;
    EditInputGroup.appendChild(tooltip);
    document.querySelectorAll(".similar-intent").forEach((intent) => {
      intent.addEventListener("click", (e) => {
        input.value = e.target.innerHTML;
        state.currentTooltip.remove();
      });
    });
  });
};

const handleEditActionClick = (e) => {
  e.preventDefault();
  const PropertyItem = e.target.closest(".output-property");
  const OutputProperties = PropertyItem.closest(".output-properties");
  const { EditInputGroup, input, icons } = createEditInputGroup({
    placeholder: "Enter the correct action for this intent",
    value: PropertyItem.dataset.data,
    buttons: [
      {
        title: "Cancel",
        icon: "cancel",
        type: "danger",
        action: () => {
          EditInputGroup.remove();
          PropertyItem.style.display = "flex";
        },
      },
      {
        title: "Submit new action",
        icon: "check",
        type: "primary",
        action: () => {
          const intent = OutputProperties.dataset.intent;
          const confirmed = confirm(
            `Are you sure? This will change the action of the intent "${intent}" to "${input.value}".`
          );
          if (!confirmed) {
            return;
          }
          const { value } = input;
          EditInputGroup.remove();
          // TestingActionContainer.style.display = "flex";
          // TestingAction.innerHTML = `<strong>Action:</strong> ${value}`;
          // TestingResponse.innerHTML = `<strong>Response:</strong> loading...`;
          // TestingResponses.innerHTML = `<p class="output-list-title">Responses:</p><span class="output-list-item">loading...</span>`;
          PropertyItem.dataset.value = value;

          axios
            .put("/training/action", {
              intent: PropertyItem.dataset.intent,
              action: value,
            })
            .then((res) => {
              if (res.data.error) {
                setAlert(res.data.error, "danger");
                return;
              }
              setAlert(res.data.message, "success");
              UpdateAndGetNLUForInput();
            })
            .catch((err) => {
              console.log("Error:", err);
              setAlert(err.response.data.error, "danger");
            });
        },
      },
    ],
  });
  // Set display none on testing-intent and make EditInputGroup the first child of testing-properties.
  PropertyItem.style.display = "none";
  OutputProperties.insertBefore(EditInputGroup, PropertyItem);
  input.focus();
};

const handleRemoveResponseClick = (e) => {
  e.preventDefault();
  const PropertyItem = e.target.closest(".output-property");
  const OutputProperties = PropertyItem.closest(".output-properties");
  if (state.nlu_response === "custom_message") {
    alert(
      "You can't remove the custom message default. Adding a new message will replace the custom message."
    );
    return;
  }
  const confirmed = confirm("Are you sure you want to remove this response?");
  if (!confirmed) {
    return;
  }
  state.responses = state.responses.filter((res) => {
    res !== state.nlu_response;
  });
  // TestingResponses.innerHTML = `<p class="output-list-title">Responses:</p><span class="output-list-item">loading...</span>`;
  // TestingResponse.innerHTML = `<strong>Response</strong> loading...`;

  const action = OutputProperties.dataset.action;

  axios
    .delete("/training/response", {
      data: {
        action: action,
        response: PropertyItem.dataset.data,
      },
    })
    .then((res) => {
      if (res.data.error) {
        setAlert(res.data.error, "danger");
        return;
      }
      setAlert(res.data.message, "success");
      UpdateAndGetNLUForInput();
    })
    .catch((err) => {
      console.log("Error:", err);
      setAlert(err.response.data.error, "danger");
    });
};

const handleAddResponseClick = (e) => {
  e.preventDefault();
  const PropertyItem = e.target.closest(".output-property");
  const OutputProperties = PropertyItem.closest(".output-properties");
  const { EditInputGroup, input, icons } = createEditInputGroup({
    placeholder: "Enter the new response",
    value: "",
    buttons: [
      {
        title: "Cancel",
        icon: "cancel",
        type: "danger",
        action: () => {
          EditInputGroup.remove();
          PropertyItem.style.display = "flex";
        },
      },
      {
        title: "Submit new response",
        icon: "check",
        type: "primary",
        action: () => {
          const action = OutputProperties.dataset.action;
          const confirmed = confirm(
            `Are you sure? This will add the response "${input.value}" to the action "${action}".`
          );
          if (!confirmed) {
            return;
          }
          const { value } = input;
          state.responses.push(value);

          axios
            .post("/training/response", {
              action: action,
              response: value,
            })
            .then((res) => {
              if (res.data.error) {
                setAlert(res.data.error, "danger");
                return;
              }
              setAlert(res.data.message, "success");
              EditInputGroup.remove();
              PropertyItem.style.display = "flex";
              UpdateAndGetNLUForInput();
            })
            .catch((err) => {
              console.log("Error:", err);
              setAlert(err.response.data.error, "danger");
            });
        },
      },
    ],
  });
  // Set display none on testing-intent and make EditInputGroup the first child of testing-properties.
  PropertyItem.style.display = "none";
  OutputProperties.insertBefore(EditInputGroup, PropertyItem);
  input.focus();
};

const onPossibleResponseClick = (e) => {
  e.preventDefault();
  TestingResponse.innerHTML = `<strong>Response</strong>: ${e.target.innerText}`;
  state.nlu_response = e.target.innerText;
};

const addPropertyEventListeners = () => {
  const EditIntents = document.querySelectorAll(".edit-intent");
  EditIntents.forEach((intent) => {
    intent.onclick = handleEditIntentClick;
  });

  const EditActions = document.querySelectorAll(".edit-action");
  EditActions.forEach((action) => {
    action.onclick = handleEditActionClick;
  });

  const RemoveResponses = document.querySelectorAll(".remove-response");
  RemoveResponses.forEach((response) => {
    response.onclick = handleRemoveResponseClick;
  });

  const AddResponses = document.querySelectorAll(".add-response");
  AddResponses.forEach((response) => {
    response.onclick = handleAddResponseClick;
  });

  const PossibleResponses = document.querySelectorAll(".possible-response");
  PossibleResponses.forEach((poss) => {
    poss.onclick = onPossibleResponseClick;
  });
};

const getLevenshteinDistance = (a, b) => {
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }

  const matrix = [];

  // increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};
