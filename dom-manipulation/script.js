document.addEventListener('DOMContentLoaded', () => {
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "The best way to predict the future is to create it.", category: "Motivation" },
        { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
        { text: "Happiness depends upon ourselves.", category: "Happiness" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteBtn = document.getElementById('newQuote');
    const categorySelect = document.getElementById('categorySelect');
    const quoteFormContainer = document.getElementById('quoteFormContainer');
    const importFileInput = document.getElementById('importFile');
    const exportBtn = document.getElementById('exportBtn');

    if (sessionStorage.getItem('lastQuote')) {
        quoteDisplay.innerHTML = sessionStorage.getItem('lastQuote');
    }

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
        const randomQuote = `"${filteredQuotes[randomIndex].text}" - ${filteredQuotes[randomIndex].category}`;
        quoteDisplay.innerHTML = randomQuote;
        sessionStorage.setItem('lastQuote', randomQuote);
    }

    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    function createAddQuoteForm() {
        quoteFormContainer.innerHTML = '';
        
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

    function addQuote() {
        const quoteText = document.getElementById('newQuoteText').value.trim();
        const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (quoteText === "" || quoteCategory === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes();
        initializeCategories();
        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";
        alert("Quote added successfully!");
    }

    function initializeCategories() {
        categorySelect.innerHTML = `<option value="all">All</option>`;
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    function exportToJsonFile() {
        const jsonData = JSON.stringify(quotes, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "quotes.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (!Array.isArray(importedQuotes)) throw new Error("Invalid file format.");
                quotes.push(...importedQuotes);
                saveQuotes();
                initializeCategories();
                alert("Quotes imported successfully!");
            } catch (error) {
                alert("Error importing file: " + error.message);
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    newQuoteBtn.addEventListener('click', showRandomQuote);
    categorySelect.addEventListener('change', showRandomQuote);
    exportBtn.addEventListener('click', exportToJsonFile);
    importFileInput.addEventListener('change', importFromJsonFile);

    initializeCategories();
    showRandomQuote();
    createAddQuoteForm();
});
