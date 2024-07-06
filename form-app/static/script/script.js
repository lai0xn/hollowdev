const apiURL = "http://localhost:10000/api/v1";

// register and auth
document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const data = { username, email, password };
    console.log(data.username);
    const response = await fetch(`${apiURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const body = await response.json();
    console.log(body);
    document.getElementById("register-form").reset();
  });
