document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "The best way to predict the future is to create it.", category: "Motivation" },
        { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
        { text: "Happiness depends upon ourselves.", category: "Happiness" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const categorySelect = document.getElementById('categorySelect');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
    const addQuoteBtn = document.getElementById('addQuoteBtn');

    // Function to show a random quote
    function showRandomQuote() {
        const selectedCategory = categorySelect.value;
        let filteredQuotes = selectedCategory === 'all' 
            ? quotes 
            : quotes.filter(quote => quote.category.toLowerCase() === selectedCategory.toLowerCase());

        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available for this category.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.innerHTML = `"${filteredQuotes[randomIndex].text}" - ${filteredQuotes[randomIndex].category}`;
    }

    // Function to add a new quote
    function addQuote() {
        const quoteText = newQuoteText.value.trim();
        const quoteCategory = newQuoteCategory.value.trim();

        if (quoteText === "" || quoteCategory === "") {
            alert("Please enter both a quote and a category.");
            return;
        }
        // Function to create and display the add quote form
    function createAddQuoteForm() {
        quoteFormContainer.innerHTML = ''; // Clear existing form (if any)

        const form = document.createElement('div');

        const inputQuote = document.createElement('input');
        inputQuote.id = 'newQuoteText';
        inputQuote.type = 'text';
        inputQuote.placeholder = 'Enter a new quote';

        const inputCategory = document.createElement('input');
        inputCategory.id = 'newQuoteCategory';
        inputCategory.type = 'text';
        inputCategory.placeholder = 'Enter quote category';

        const addButton = document.createElement('button');
        addButton.innerText = 'Add Quote';
        addButton.addEventListener('click', addQuote);

        form.appendChild(inputQuote);
        form.appendChild(inputCategory);
        form.appendChild(addButton);

        quoteFormContainer.appendChild(form);
    }

        quotes.push({ text: quoteText, category: quoteCategory });

        // Add new category to dropdown 
        if (![...categorySelect.options].some(option => option.value.toLowerCase() === quoteCategory.toLowerCase())) {
            const newOption = document.createElement('option');
            newOption.value = quoteCategory;
            newOption.textContent = quoteCategory;
            categorySelect.appendChild(newOption);
        }

        newQuoteText.value = "";
        newQuoteCategory.value = "";
        alert("Quote added successfully!");
    }

    // Function to initialize categories dropdown
    function initializeCategories() {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Event Listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    addQuoteBtn.addEventListener('click', addQuote);
    categorySelect.addEventListener('change', showRandomQuote);

    // Initialize app
    initializeCategories();
    showRandomQuote();
});
