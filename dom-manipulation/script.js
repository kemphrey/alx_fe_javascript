const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API
const LOCAL_STORAGE_KEY = "quotes";

// Get DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const lastSyncTime = document.getElementById("lastSyncTime");

// Load quotes from local storage
let quotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
// 🛑 Show Notification
function showNotification(message, type = "info") {
    notificationBox.innerHTML = message;
    notificationBox.className = `notification ${type}`;
    notificationBox.style.display = "block";
    
    setTimeout(() => {
        notificationBox.style.display = "none";
    }, 3000);
}

// 🟢 Fetch Quotes from Mock Server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();

        let localQuotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        let mergedQuotes = mergeQuotes(localQuotes, serverQuotes);

        // 🛑 Conflict Resolution: Notify if local data was overwritten
        if (localQuotes.length > 0 && mergedQuotes.length !== localQuotes.length) {
            showNotification("⚠️ Some local quotes were updated from the server!", "warning");
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedQuotes));
        quotes = mergedQuotes;
        displayRandomQuote();
        populateCategories();
        updateSyncTime();
        
        showNotification("✅ Quotes synced with server!", "success"); // 🆕 Notify user
    } catch (error) {
        console.error("Error fetching quotes:", error);
        showNotification("❌ Error syncing quotes. Check your connection!", "error"); // 🆕 Show error
    }
}
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available. Add one!";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>`;
}

// 🔄 Merge Local and Server Quotes (Avoid Duplication)
function mergeQuotes(local, server) {
    let merged = [...local];

    server.forEach(serverQuote => {
        const existingQuote = local.find(q => q.id === serverQuote.id);
        if (!existingQuote) {
            merged.push(serverQuote);
        }
    });

    return merged;
}

// 🆕 Add New Quote (Local + Server)
async function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value;
    const category = document.getElementById("newQuoteCategory").value;

    if (quoteText.trim() === "" || category.trim() === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    let newQuote = {
        id: Date.now(),
        text: quoteText,
        category: category,
        timestamp: new Date().toISOString()
    };

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
        `;
        document.body.appendChild(formContainer);

        document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
    }
    quotes.push(newQuote);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));

    try {
        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(newQuote),
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error syncing quote to server:", error);
    }

    populateCategories();
    displayRandomQuote();
}

// 🔄 Sync Quotes (Bidirectional Sync)
async function syncQuotes() {
    try {
        console.log("🔄 Syncing quotes...");

        // Fetch server quotes
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();

        let localQuotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        let mergedQuotes = mergeQuotes(localQuotes, serverQuotes);

        // Sync changes to the server
        for (let quote of mergedQuotes) {
            try {
                await fetch(`${API_URL}/${quote.id}`, {
                    method: "PUT",
                    body: JSON.stringify(quote),
                    headers: { "Content-Type": "application/json" }
                });
            } catch (error) {
                console.error("Error updating quote:", error);
            }
        }

        // Update local storage with merged data
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedQuotes));
        quotes = mergedQuotes;

        console.log("✅ Sync complete!");
        updateSyncTime();
        displayRandomQuote();
        populateCategories();
    } catch (error) {
        console.error("Error syncing quotes:", error);
    }
}

// 🗑 Remove Quote
async function removeQuote(quoteId) {
    quotes = quotes.filter(q => q.id !== quoteId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));

    try {
        await fetch(`${API_URL}/${quoteId}`, { method: "DELETE" });
    } catch (error) {
        console.error("Error deleting quote:", error);
    }

    displayRandomQuote();
}

// 🔄 Display a Random Quote
function displayRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
    }
    let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
}

// 📂 Export Quotes as JSON
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 📥 Import Quotes from JSON File
function importQuotes(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
        alert("Quotes imported successfully!");
        displayRandomQuote();
        populateCategories(); // Ensure new categories show up
    };
    fileReader.readAsText(event.target.files[0]);
}

// 🔍 Populate Category Filter
function populateCategories() {
    let categories = ["All Categories", ...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = categories
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join("");
}

// 🔎 Filter Quotes by Category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("lastSelectedCategory", selectedCategory);
    
    let filteredQuotes = selectedCategory === "All Categories"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    quoteDisplay.innerText = filteredQuotes.length
        ? `"${filteredQuotes[0].text}" - Category: ${filteredQuotes[0].category}`
        : "No quotes available in this category.";
}

// 🕒 Update Last Sync Time
function updateSyncTime() {
    lastSyncTime.innerHTML = `Last Sync: ${new Date().toLocaleTimeString()}`;
}

// 🏁 Initialize App
document.addEventListener("DOMContentLoaded", () => {
    fetchQuotesFromServer();
    populateCategories();
    displayRandomQuote();
    createAddQuoteForm();
    showRandomQuote();
});

// 🕒 Auto-Sync Every 60 Seconds
setInterval(syncQuotes, 60000);

// ✅ Event Listeners
newQuoteBtn.addEventListener("click", displayRandomQuote);
document.getElementById("importFile").addEventListener("change", importQuotes);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
document.getElementById("syncButton").addEventListener("click", syncQuotes);
