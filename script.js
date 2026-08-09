// Default Password for Admin Lock
const ADMIN_PASSWORD = "admin123";

// Online Database URL (Firebase REST API)
const DB_URL = "https://study-helper-default-rtdb.firebaseio.com/studyData";

document.addEventListener("DOMContentLoaded", () => {
    displayQuestions();
    setupAdminLock();
});

// Fetch and Display Data
function displayQuestions() {
    let container = document.getElementById("questionContainer");

    fetch(`${DB_URL}.json`)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = "";

            if (!data) {
                // Fallback to local storage if online data is empty
                let localData = JSON.parse(localStorage.getItem("studyData")) || [];
                if (localData.length === 0) {
                    container.innerHTML = "<p style='text-align:center; color:#64748b;'>No study material added yet. Please add content from Admin Panel.</p>";
                    return;
                }
                renderList(localData, container, true);
                return;
            }

            renderList(data, container, false);
        })
        .catch(error => {
            console.error("Error loading data:", error);
            // Fallback to LocalStorage if network error
            let localData = JSON.parse(localStorage.getItem("studyData")) || [];
            if (localData.length === 0) {
                container.innerHTML = "<p style='text-align:center; color:#64748b;'>No study material added yet. Please add content from Admin Panel.</p>";
            } else {
                renderList(localData, container, true);
            }
        });
}

// Render Items on Screen
function renderList(data, container, isLocal) {
    container.innerHTML = "";
    
    if (isLocal) {
        data.forEach((item, index) => {
            createCard(item, index, container, true);
        });
    } else {
        Object.keys(data).forEach(key => {
            createCard(data[key], key, container, false);
        });
    }
}

// Create Card UI
function createCard(item, id, container, isLocal) {
    let card = document.createElement("div");
    card.classList.add("q-card");

    let linkHTML = item.link ? `<br><a href="${item.link}" target="_blank" class="btn-link">📄 Open Drive Link (${item.title || 'View Resource'})</a>` : "";

    card.innerHTML = `
        <span class="tag">${item.subject}</span>
        <h3>${item.title || 'Study Material'}</h3>
        ${linkHTML}
        <button class="delete-btn" onclick="deleteContent('${id}', ${isLocal})">Delete</button>
    `;
    container.appendChild(card);
}

// Setup Password Lock for Admin Panel
function setupAdminLock() {
    let adminSection = document.getElementById("admin");
    let form = document.getElementById("addQuestionForm");

    if (form) {
        form.classList.add("hidden");
    }

    let lockDiv = document.createElement("div");
    lockDiv.id = "lockBox";
    lockDiv.classList.add("lock-box");
    lockDiv.innerHTML = `
        <p>🔑 Enter Admin Password to Access Control Panel:</p>
        <input type="password" id="passInput" placeholder="Enter Password">
        <button onclick="checkPassword()" class="btn btn-admin">Unlock</button>
        <p id="errorMsg" style="color: red; margin-top: 10px;"></p>
    `;

    if (adminSection) {
        adminSection.appendChild(lockDiv);
    }
}

// Verify Password
function checkPassword() {
    let input = document.getElementById("passInput").value;
    let errorMsg = document.getElementById("errorMsg");
    let form = document.getElementById("addQuestionForm");
    let lockBox = document.getElementById("lockBox");

    if (input === ADMIN_PASSWORD) {
        lockBox.style.display = "none";
        form.classList.remove("hidden");
        alert("Admin Panel Unlocked Successfully!");
    } else {
        errorMsg.innerText = "❌ Incorrect Password! Please try again.";
    }
}

// Add New Content
function addContent(event) {
    event.preventDefault();

    let subject = document.getElementById("subjectInput").value.trim();
    let title = document.getElementById("titleInput").value.trim();
    let link = document.getElementById("linkInput").value.trim();

    let newEntry = { subject, title, link };

    // 1. Save Online
    fetch(`${DB_URL}.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry)
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById("addQuestionForm").reset();
        alert("New Drive link added successfully!");
        displayQuestions();
    })
    .catch(() => {
        // Fallback: Save Locally if online fails
        let localData = JSON.parse(localStorage.getItem("studyData")) || [];
        localData.push(newEntry);
        localStorage.setItem("studyData", JSON.stringify(localData));
        document.getElementById("addQuestionForm").reset();
        alert("Saved locally!");
        displayQuestions();
    });
}

// Delete Content
function deleteContent(id, isLocal) {
    let pass = prompt("Enter Admin Password to delete this item:");
    if (pass === ADMIN_PASSWORD) {
        if (isLocal) {
            let localData = JSON.parse(localStorage.getItem("studyData")) || [];
            localData.splice(id, 1);
            localStorage.setItem("studyData", JSON.stringify(localData));
            displayQuestions();
            alert("Item deleted!");
        } else {
            fetch(`${DB_URL}/${id}.json`, { method: "DELETE" })
                .then(() => {
                    alert("Item deleted successfully!");
                    displayQuestions();
                });
        }
    } else if (pass !== null) {
        alert("❌ Incorrect Password!");
    }
}

// Search Filter
function filterQuestions() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let cards = document.getElementsByClassName("q-card");

    Array.from(cards).forEach(card => {
        let text = card.innerText.toLowerCase();
        if (text.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
