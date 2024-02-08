document.addEventListener('DOMContentLoaded', () => {
    const preferencesBtn = document.getElementById('preferencesBtn');
    const preferencesModal = document.getElementById('preferencesModal');
    const closeBtn = preferencesModal.querySelector('.close-btn');
    const preferencesForm = document.getElementById('preferencesForm');
    const categoryCheckboxes = document.getElementById('categoryCheckboxes');
    const categorySelect = document.getElementById('category');

    // Sample categories
    const allCategories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

    // Dynamically populate checkboxes for each category
    allCategories.forEach(category => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'categories';
        checkbox.value = category;
        checkbox.checked = true; // Default to checked

        const label = document.createElement('label');
        label.textContent = category;

        categoryCheckboxes.appendChild(checkbox);
        categoryCheckboxes.appendChild(label);
        categoryCheckboxes.appendChild(document.createElement('br'));
    });

    // Open the preferences modal
    preferencesBtn.addEventListener('click', () => {
        preferencesModal.style.display = 'block';
    });

    // Close the preferences modal
    closeBtn.addEventListener('click', () => {
        preferencesModal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === preferencesModal) {
            preferencesModal.style.display = 'none';
        }
    });

    // Handle form submission
    preferencesForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get selected categories
        const selectedCategories = Array.from(preferencesForm.elements.categories)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // Save preferences to local storage
        saveUserPreferences({ categories: selectedCategories });

        // Update the category select options
        updateCategorySelect(selectedCategories);

        // Close the modal
        preferencesModal.style.display = 'none';
    });

    // Function to fetch news based on the selected category
    async function fetchNews(category) {
        try {
            const response = await fetch(`/api/news?category=${category}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch news: ${response.statusText}`);
            }
            const news = await response.json();
            // Filter out news with content "[Removed]" 
            const filteredNews = news.filter(article => article.content !== "[Removed]");

            displayNews(filteredNews,category);
        } catch (error) {
            console.error(error);
        }
    }

    // Function to update the news list in the DOM
    function displayNews(news,category) {
        const newsList = document.getElementById('newsList');
        // Clear existing news items
        newsList.innerHTML = '';

        // Iterate through the news and create list items
        news.forEach(headline => {
            const card = document.createElement('div');
            card.className = 'news-card';

            const link = document.createElement('a');
            link.href = headline.url;
            link.target = '_blank';

            const image = document.createElement('img');
            image.alt = headline.title;
            if (headline.urlToImage) {
                image.src = headline.urlToImage;
            } else {
                image.src = '../public/images/news.jpg'; 
            }
            image.className = 'card-image';

            const categoryColorMap = {
                general: 'general-color',
                business: 'business-color',
                entertainment: 'entertainment-color',
                health: 'health-color',
                science: 'science-color',
                sports: 'sports-color',
                technology: 'technology-color',
            };  
            const typeButton = document.createElement('button');
            typeButton.className = 'card-type';
            const cat = capitalizeFirstLetter(category);
            typeButton.textContent = cat || 'Uncategorized';

            // Specific class based on the category
            const categoryColorClass = categoryColorMap[category] || 'uncategorized-color';
            typeButton.classList.add(categoryColorClass);   

            const title = document.createElement('h2');
            title.className = 'card-title';
            title.textContent = headline.title;

            const description = document.createElement('p');
            description.className = 'card-description';
            description.textContent = headline.description;

            const authorDateContainer = document.createElement('div');
            authorDateContainer.className = 'card-author-date';

            const author = document.createElement('span');
            author.className = 'card-author';
            author.textContent = `By ${headline.author || 'Unknown Author'}`;

            const date = document.createElement('span');
            date.className = 'card-date';
            date.textContent = new Date(headline.publishedAt).toLocaleDateString();

            authorDateContainer.appendChild(author);
            authorDateContainer.appendChild(date);

            link.appendChild(image);

            card.appendChild(link);
            card.appendChild(typeButton);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(authorDateContainer);

            newsList.appendChild(card);
        });
    }

    // Add event listener to the category selector form
    //const categoryForm = document.getElementById('categoryForm');
    categoryForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        const selectedCategory = document.getElementById('category').value;
        fetchNews(selectedCategory);
    });

    // Initial fetch when the page loads
    const storedPreferences = getUserPreferences();
    const initialCategory = storedPreferences.categories.length > 0 ? storedPreferences.categories[0] : 'general';
    fetchNews(initialCategory);

    // Function to update the category select options
    function updateCategorySelect(selectedCategories) {
        // Clear existing options
        categorySelect.innerHTML = '';

        // Add options based on selected categories
        selectedCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = capitalizeFirstLetter(category); // Assuming you have a function to capitalize the first letter
            categorySelect.appendChild(option);
        });
    }

    // Function to save user preferences to local storage
    function saveUserPreferences(preferences) {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }

    // Function to read user preferences from local storage
    function getUserPreferences() {
        const storedPreferences = localStorage.getItem('userPreferences');
        return storedPreferences ? JSON.parse(storedPreferences) : { categories: [] };
    }

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

});

// Function to save user preferences to local storage
function saveUserPreferences(preferences) {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));   
}