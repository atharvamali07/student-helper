// Default Password for Admin Lock
const ADMIN_PASSWORD = "admin123";

// Firebase Configuration (Cloud Database)
const firebaseConfig = {
    databaseURL: "https://study-helper-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

document.addEventListener("DOMContentLoaded", () => {
    displayQuestions();
    setupAdminLock();
});

// Fetch data from Online Database (Firebase)
function displayQuestions() {
    let container = document.getElementById("questionContainer");
    
    database.ref("studyData").on("value", (snapshot) => {
        container.innerHTML = "";
        let data = snapshot.val();

        if (!data) {
            container.innerHTML = "<p style='text-align:center; color:#64748b;'>अजून कोणताही डेटा जोडलेला नाही. Admin Panel मधून डेटा जोडा.</p>";
            return;
        }

        Object.keys(data).forEach((key) => {
            let item = data[key];
            let card = document.createElement("div");
            card.classList.add("q-card");

            let linkHTML = item.link ? `<br><a href="${item.link}" target="_blank" class="btn-link">📄 Open Drive Link (${item.title || 'View Resource'})</a>` : "";

            card.innerHTML = `
                <span class="tag">${item.subject}</span>
                <h3>${item.title || 'Study Material'}</h3>
                ${linkHTML}
                <button class="delete-btn" onclick="deleteContent('${key}')">Delete</button>
            `;
            container.appendChild(card);
        });
    });
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
        <p>🔑 Admin Panel वापरण्यासाठी पासवर्ड टाका:</p>
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
        alert("Admin Panel Unlocked!");
    } else {
        errorMsg.innerText = "❌ चुकीचा पासवर्ड! पुन्हा प्रयत्न करा.";
    }
}

// Add New Link from Mobile/Laptop to Online Database
function addContent(event) {
    event.preventDefault();

    let subject = document.getElementById("subjectInput").value.trim();
    let title = document.getElementById("titleInput").value.trim();
    let link = document.getElementById("linkInput").value.trim();

    // Push data to online database
    database.ref("studyData").push({
        subject: subject,
        title: title,
        link: link
    }).then(() => {
        document.getElementById("addQuestionForm").reset();
        alert("नवीन Drive Link यशस्वीरीत्या जोडली गेली! सर्व उपकरणांवर दिसेल.");
    }).catch((error) => {
        alert("त्रुटी आली: " + error.message);
    });
}

// Delete item from Online Database
function deleteContent(key) {
    let pass = prompt("डेटा डिलीट करण्यासाठी Admin Password टाका:");
    if (pass === ADMIN_PASSWORD) {
        database.ref("studyData/" + key).remove().then(() => {
            alert("डेटा डिलीट झाला!");
        });
    } else if (pass !== null) {
        alert("❌ चुकीचा पासवर्ड! डिलीट करता आले नाही.");
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
