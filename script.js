// LocalStorage मधून डेटा लोड करणे (Page Refresh झाल्यावर डेटा जाणार नाही)
document.addEventListener("DOMContentLoaded", displayQuestions);

function getQuestions() {
    let questions = localStorage.getItem("studyData");
    return questions ? JSON.parse(questions) : [];
}

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

// Admin Form द्वारे नवीन Content जोडणे
function addContent(event) {
    event.preventDefault();

    let subject = document.getElementById("subjectInput").value.trim();
    let topic = document.getElementById("topicInput").value.trim();
    let type = document.getElementById("typeInput").value;
    let link = document.getElementById("linkInput").value.trim();

    let questions = getQuestions();
    questions.push({ subject, topic, type, link });

    localStorage.setItem("studyData", JSON.stringify(questions));

    // Form Reset करणे
    document.getElementById("addQuestionForm").reset();

    // UI अपडेट करणे
    displayQuestions();
    alert("नवीन डेटा यशस्वीरीत्या जोडला गेला!");
}

// Admin कडून कंटेंट डिलीट करणे
function deleteContent(index) {
    if (confirm("तुम्हाला हा प्रश्न/नोट डिलीट करायची आहे का?")) {
        let questions = getQuestions();
        questions.splice(index, 1);
        localStorage.setItem("studyData", JSON.stringify(questions));
        displayQuestions();
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
