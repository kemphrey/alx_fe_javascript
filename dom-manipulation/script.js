document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const categoryFilter = document.getElementById("categoryFilter");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
    
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
    ];
    
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }
    
    function populateCategories() {
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        
        const savedCategory = localStorage.getItem("selectedCategory");
        if (savedCategory) {
            categoryFilter.value = savedCategory;
        }
    }
    
    function showRandomQuote() {
        const selectedCategory = categoryFilter.value;
        const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available for this category.";
        } else {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            quoteDisplay.innerHTML = filteredQuotes[randomIndex].text;
        }
    }
    
    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();
        if (text && category) {
            quotes.push({ text, category });
            saveQuotes();
            populateCategories();
            newQuoteText.value = "";
            newQuoteCategory.value = "";
        } else {
            alert("Please enter both a quote and a category.");
        }
    }
    
    function filterQuotes() {
        localStorage.setItem("selectedCategory", categoryFilter.value);
        showRandomQuote();
    }
    
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
    categoryFilter.addEventListener("change", filterQuotes);
    
    populateCategories();
    showRandomQuote();
});
