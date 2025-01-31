const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API
const LOCAL_STORAGE_KEY = "quotes";

// Load quotes from local storage
let quotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

// Sync Quotes (Fetch + Merge)
async function syncQuotes() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();

        let localQuotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        let mergedQuotes = mergeQuotes(localQuotes, serverQuotes);

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedQuotes));
        quotes = mergedQuotes;
        
        displayRandomQuote();
        notifyUser("Quotes synced successfully!");
    } catch (error) {
        console.error("Error syncing quotes:", error);
    }
}

// Merge Local and Server Quotes
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

// Display a Random Quote
function displayRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById("quoteDisplay").innerText = "No quotes available.";
        return;
    }
    let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById("quoteDisplay").innerText = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// Notify User of Updates
function notifyUser(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerText = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Auto-Sync Every 60 Seconds
setInterval(syncQuotes, 60000);

document.addEventListener("DOMContentLoaded", () => {
    syncQuotes();
    displayRandomQuote();
});
