const apiBaseUrl = "http://localhost:8080/api/v1";

// Utility function to fetch with authorization
const fetchWithAuth = (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!options.headers) {
        options.headers = {};
    }
    options.headers["Authorization"] = "Bearer " + token;
    return fetch(url, options);
};

//logout
document.getElementById("logout").addEventListener("click", async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    document.getElementById("user-section").style.display = "none";
    document.getElementById("admin-section").style.display = "none";
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("logout").style.display = "none";
});
// check if user is logged in
if (localStorage.getItem("token")) {
    if (localStorage.getItem("role") === "NORMAL") {
        document.getElementById("user-section").style.display = "block";
        document.getElementById("logout").style.display = "block";
    } else if (localStorage.getItem("role") === "ADMIN") {
        document.getElementById("admin-section").style.display = "block";
        document.getElementById("logout").style.display = "block";
    }
    document.getElementById("auth-section").style.display = "none";
}

// Register user
document
    .getElementById("register-form")
    .addEventListener("submit", async (e) => {
        try {
            e.preventDefault();
            const firstname = document.getElementById("firstname").value;
            const lastname = document.getElementById("lastname").value;
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch(`${apiBaseUrl}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    username,
                    email,
                    password,
                }),
            });
            const data = await response.json();
            console.log(data);
            // save token to local storage
            localStorage.setItem("token", data.token);
            // save role to local storage
            localStorage.setItem("role", data.role);
            // Display sections based on user type
            if (data.role === "NORMAL") {
                document.getElementById("user-section").style.display = "block";
                document.getElementById("auth-section").style.display = "none";
                document.getElementById("logout").style.display = "block";

            } else if (data.role === "ADMIN") {
                document.getElementById("admin-section").style.display = "block";
                document.getElementById("auth-section").style.display = "none";
                document.getElementById("logout").style.display = "block";

            } else {
                displayResults(data)
            }
        } catch (e) {
            console.log(e);
        }
    });

// Login user
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch(`${apiBaseUrl}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        console.log(data.role);
        // Display sections based on user type
        if (data.role === "NORMAL") {
            document.getElementById("user-section").style.display = "block";
            document.getElementById("logout").style.display = "block";
        } else if (data.role === "ADMIN") {
            document.getElementById("admin-section").style.display = "block";
            document.getElementById("logout").style.display = "block";
        }
        document.getElementById("auth-section").style.display = "none";
    }
    console.log(data);
});

// View all elections
document
    .getElementById("view-elections")
    .addEventListener("click", async () => {
        const response = await fetchWithAuth(`${apiBaseUrl}/election/all`);
        const data = await response.json();
        displayResults(data);
    });

// Get all candidates for election
document
    .getElementById("view-candidates")
    .addEventListener("click", async () => {
        const electionId = prompt("Enter Election ID");
        if (electionId === null) {
            alert("Please fill all fields");
            return;
        }
        const response = await fetchWithAuth(
            `${apiBaseUrl}/election/${electionId}/candidates`,
        );
        const data = await response.json();
        displayResults(data);
    });

// Vote for a candidate
document
    .getElementById("vote-candidate")
    .addEventListener("click", async () => {
        const candidateId = prompt("Enter Candidate ID");
        if (candidateId === null) {
            alert("Please fill all fields");
            return;
        }
        const response = await fetchWithAuth(`${apiBaseUrl}/votes/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ candidateId }),
        });
        const data = await response.json();
        displayResults(data);
    });
// Admin : admin register
document.getElementById("add-admin").addEventListener("click", async (e) => {
    try {
        e.preventDefault();
        const firstname = prompt("Enter First Name");
        const lastname = prompt("Enter Last Name");
        const username = prompt("Enter Username");
        const email = prompt("Enter Email");
        const password = prompt("Enter Password");
        if (
            firstname === null ||
            lastname === null ||
            username === null ||
            email === null ||
            password === null
        ) {
            alert("Please fill all fields");
            return;
        }
        const response = await fetchWithAuth(`${apiBaseUrl}/user/registerAdmin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstname, lastname, username, email, password }),
        });

        const data = await response.json();
        displayResults(data);
        console.log(data);

    }catch (e) {
        console.log(e);
    }
});
// Admin : view all users
document.getElementById("view-users").addEventListener("click", async () => {
    const response = await fetchWithAuth(`${apiBaseUrl}/user/all`);
    const data = await response.json();
    displayResults(data);
});
// Admin : view all candidates for election
document.getElementById("admin-view-candidate").addEventListener("click", async () => {
    const electionId = prompt("Enter Election ID");
    if (electionId === null) {
        alert("Please fill all fields");
        return;
    }
    const response = await fetchWithAuth(
        `${apiBaseUrl}/election/${electionId}/candidates`,
    );
    const data = await response.json();
    displayResults(data);
});
// Admin : view election
document.getElementById("admin-view-election").addEventListener("click", async () => {
    const response = await fetchWithAuth(`${apiBaseUrl}/election/all`);
    const data = await response.json();
    displayResults(data);
});
// Admin: Add candidate
document.getElementById("add-candidate").addEventListener("click", async () => {
    const userId = prompt("Enter User ID");
    const electionId = prompt("Enter Election ID");
    if (userId === null || electionId === null) {
        alert("Please fill all fields");
        return;
    }
    const response = await fetchWithAuth(`${apiBaseUrl}/candidate/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, electionId }),
    });
    const data = await response.json();
    displayResults(data);
});
// Admin : add election
document.getElementById("add-election").addEventListener("click", async (e) => {
    e.preventDefault();
    const electionName = prompt("Enter Election Name");
    const electionStartDate = prompt("Enter Start Election Date");
    const electionEndDate = prompt("Enter End Election Date");
    if (
        electionName === null ||
        electionStartDate === null ||
        electionEndDate === null
    ) {
        alert("Please fill all fields");
        return;
    }
    const response = await fetchWithAuth(`${apiBaseUrl}/election/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ electionName, electionStartDate , electionEndDate }),
    });
    const data = await response.json();
    displayResults(data);
    console.log(data);
});
// Admin: Delete candidate
document
    .getElementById("delete-candidate")
    .addEventListener("click", async () => {
        const candidateId = prompt("Enter Candidate ID");
        if (candidateId === null) {
            alert("Please fill all fields");
            return;
        }
        const response = await fetchWithAuth(
            `${apiBaseUrl}/candidate/delete/${candidateId}`,
            {
                method: "DELETE",
            },
        );
        const data = await response.json();
        displayResults(data);
    });

// Admin: Delete election
document
    .getElementById("delete-election")
    .addEventListener("click", async () => {
        const electionId = prompt("Enter Election ID");
        const response = await fetchWithAuth(
            `${apiBaseUrl}/election/delete/${electionId}`,
            {
                method: "DELETE",
            },
        );
        const data = await response.json();
        displayResults(data);
    });

// Admin: get election rank
document
    .getElementById("election-rank")
    .addEventListener("click", async () => {
        const electionId = prompt("Enter Election ID");
        const response = await fetchWithAuth(
            `${apiBaseUrl}/election/${electionId}/rank`,
        );
        const data = await response.json();
        displayResults(data);
    });
// Utility function to display results
const displayResults = (data) => {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = JSON.stringify(data, null, 2);
};
