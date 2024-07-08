document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("registerForm")
    .addEventListener("submit", registerUser);
  document.getElementById("loginForm").addEventListener("submit", loginUser);
  document.getElementById("createForm").addEventListener("submit", createForm);
  document.getElementById("addField").addEventListener("click", addField);
  document.getElementById("getForms").addEventListener("click", getForms);

  // Add event delegation for dynamic buttons
  document.addEventListener("click", function (event) {
    if (event.target.matches(".toggleCanRespond")) {
      const formId = event.target.getAttribute("data-form-id");
      const currentCanRespond = JSON.parse(
        event.target.getAttribute("data-can-respond"),
      );
      const newCanRespond = !currentCanRespond;

      changeCanRespond(formId, newCanRespond)
        .then(() => {
          event.target.setAttribute("data-can-respond", newCanRespond);
          event.target.textContent = newCanRespond
            ? "Disable Responses"
            : "Enable Responses";
          alert("Can respond status changed successfully");
        })
        .catch((error) => {
          console.error("Error changing can respond status:", error.message);
          alert(`Error: ${error.message}`);
        });
    }

    if (event.target.matches(".deleteForm")) {
      const formId = event.target.getAttribute("data-id");
      deleteForm(formId);
    }
  });
});

function registerUser(event) {
  event.preventDefault();
  const form = event.target;
  const data = {
    username: form.username.value,
    email: form.email.value,
    password: form.password.value,
  };

  fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        localStorage.setItem("token", data.token);
        alert("User registered successfully");
      }
    });
}

function loginUser(event) {
  event.preventDefault();
  const form = event.target;
  const data = {
    auth_identifier: form.auth_identifier.value,
    password: form.password.value,
  };

  fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        alert("User logged in successfully");
        localStorage.setItem("token", data.token);
      }
    });
}

function createForm(event) {
  event.preventDefault();
  const form = event.target;
  const token = localStorage.getItem("token");

  const fields = [];
  document
    .querySelectorAll("#fieldsContainer .field")
    .forEach((fieldElement) => {
      const field = {
        label: fieldElement.querySelector('[name="label"]').value,
        type: fieldElement.querySelector('[name="type"]').value,
        isRequired: fieldElement.querySelector('[name="isRequired"]').checked,
        options: fieldElement
          .querySelector('[name="options"]')
          .value.split(","),
      };
      fields.push(field);
    });

  const data = {
    name: form.name.value,
    description: form.description.value,
    canRespond: form.canRespond.checked,
    fields,
  };

  fetch("/api/forms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        alert("Form created successfully");
      }
    });
}

function addField() {
  const fieldContainer = document.createElement("div");
  fieldContainer.className = "field";
  fieldContainer.innerHTML = `
        <label for="label">Label:</label>
        <input type="text" name="label" required>
        <label for="type">Type:</label>
        <select name="type" required>
            <option value="text">Text</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="select">Select</option>
        </select>
        <label for="isRequired">Required:</label>
        <input type="checkbox" name="isRequired">
        <label for="options">Options (comma separated for select/radio):</label>
        <input type="text" name="options">
        <button type="button" class="removeField">Remove</button>
    `;
  document.getElementById("fieldsContainer").appendChild(fieldContainer);

  fieldContainer.querySelector(".removeField").addEventListener("click", () => {
    fieldContainer.remove();
  });
}

function getForms() {
  const token = localStorage.getItem("token");

  fetch("/api/forms", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        console.log(data);
        alert("Forms fetched successfully");
        // Inject the forms into the DOM
        const formList = document.getElementById("formsList");
        formList.innerHTML = "";
        data.forEach((form) => {
          const formElement = document.createElement("div");
          formElement.innerHTML = `
            <h4>${form.name}</h4>
            <p>${form.description}</p>
            <p>Can respond: ${form.canRespond ? "Yes" : "No"}</p>
            <a href="/form.html?id=${form._id}">View form</a>
            <a href="/response.html?id=${form._id}">View responses</a>
            <button class="toggleCanRespond" data-form-id="${form._id}" data-can-respond="${form.canRespond}">
              ${form.canRespond ? "Disable Responses" : "Enable Responses"}
            </button>
            <button class="deleteForm" data-id="${form._id}">Delete</button>
          `;
          formList.appendChild(formElement);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching forms:", error);
      alert(`Error fetching forms: ${error.message}`);
    });
}

async function changeCanRespond(formId, canRespond) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`/api/forms/${formId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ canRespond }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update canRespond status for form ${formId}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
}

function deleteForm(formId) {
  const token = localStorage.getItem("token");

  fetch(`/api/forms/${formId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        alert("Form deleted successfully");
        // Optionally update UI or redirect after successful deletion
      }
    })
    .catch((error) => {
      console.error("Error deleting form:", error);
      alert(`Error deleting form: ${error.message}`);
    });
}
