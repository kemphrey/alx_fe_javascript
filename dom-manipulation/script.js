const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API
const LOCAL_STORAGE_KEY = "quotes";

// Get DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const lastSyncTime = document.getElementById("lastSyncTime");
const notificationBox = document.getElementById("notificationBox"); // 🆕 Add this to your HTML!

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

        showNotification("✅ Quotes synced with server!", "success"); // 🆕 Show success message
    } catch (error) {
        console.error("Error syncing quotes:", error);
        showNotification("❌ Error syncing with server!", "error"); // 🆕 Show error message
    }
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
});

// 🕒 Auto-Sync Every 60 Seconds
setInterval(syncQuotes, 60000);

// ✅ Event Listeners
newQuoteBtn.addEventListener("click", displayRandomQuote);
document.getElementById("syncButton").addEventListener("click", syncQuotes);
