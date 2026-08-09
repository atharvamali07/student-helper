// Default Password for Admin Lock
const ADMIN_PASSWORD = "admin123";

document.addEventListener("DOMContentLoaded", () => {
    displayQuestions();
    setupAdminLock();
});

// Load stored data from LocalStorage
function getQuestions() {
    let questions = localStorage.getItem("studyData");
    return questions ? JSON.parse(questions) : [];
}

// Display questions in the DOM
function displayQuestions() {
    let container = document.getElementById("questionContainer");
    container.innerHTML = "";
    let questions = getQuestions();

    if (questions.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#64748b;'>अजून कोणताही डेटा जोडलेला नाही. Admin Panel मधून डेटा जोडा.</p>";
        return;
    }

    questions.forEach((item, index) => {
        let card = document.createElement("div");
        card.classList.add("q-card");

        let linkHTML = item.link ? `<br><a href="${item.link}" target="_blank" class="btn-link">📄 Open Notes / Drive Link</a>` : "";

        card.innerHTML = `
            <span class="tag">${item.subject}</span>
            <h3>${item.topic}</h3>
            <p>Type: ${item.type}</p>
            ${linkHTML}
            <button class="delete-btn" onclick="deleteContent(${index})">Delete</button>
        `;
        container.appendChild(card);
    });
}

// Setup Password Lock for Admin Panel
function setupAdminLock() {
    let adminSection = document.getElementById("admin");
    let form = document.getElementById("addQuestionForm");

    form.classList.add("hidden");

    let lockDiv = document.createElement("div");
    lockDiv.id = "lockBox";
    lockDiv.classList.add("lock-box");
    lockDiv.innerHTML = `
        <p>🔑 Admin Panel वापरण्यासाठी पासवर्ड टाका:</p>
        <input type="password" id="passInput" placeholder="Enter Password">
        <button onclick="checkPassword()" class="btn btn-admin">Unlock</button>
        <p id="errorMsg" style="color: red; margin-top: 10px;"></p>
    `;

    adminSection.appendChild(lockDiv);
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
        alert("Admin Panel Unlocked!");
    } else {
        errorMsg.innerText = "❌ चुकीचा पासवर्ड! पुन्हा प्रयत्न करा.";
    }
}

// Add new entry from Admin Form
function addContent(event) {
    event.preventDefault();

    let subject = document.getElementById("subjectInput").value.trim();
    let topic = document.getElementById("topicInput").value.trim();
    let type = document.getElementById("typeInput").value;
    let link = document.getElementById("linkInput").value.trim();

    let questions = getQuestions();
    questions.push({ subject, topic, type, link });

    localStorage.setItem("studyData", JSON.stringify(questions));

    document.getElementById("addQuestionForm").reset();
    displayQuestions();
    alert("नवीन डेटा यशस्वीरीत्या जोडला गेला!");
}

// Delete item
function deleteContent(index) {
    let pass = prompt("डेटा डिलीट करण्यासाठी Admin Password टाका:");
    if (pass === ADMIN_PASSWORD) {
        let questions = getQuestions();
        questions.splice(index, 1);
        localStorage.setItem("studyData", JSON.stringify(questions));
        displayQuestions();
        alert("डेटा डिलीट झाला!");
    } else if (pass !== null) {
        alert("❌ चुकीचा पासवर्ड! डिलीट करता आले नाही.");
    }
}

// Filter / Search Logic
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
