document.addEventListener('DOMContentLoaded', () => {

    const formContainer = document.getElementById('formContainer');

    const allCategories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
    // Check if there are stored preferences in local storage
    const storedPreferences = getUserPreferences();
    const userCategories = storedPreferences.categories;

    const categoryForm = document.createElement('form');
    categoryForm.id = 'categoryForm';

    const label = document.createElement('label');
    label.textContent = 'Select a category:';
    label.setAttribute('for', 'category');

    const select = document.createElement('select');
    select.id = 'category';
    select.name = 'category';

    const cats = userCategories.length === 0 ? allCategories : userCategories;

    // Populate select options based on stored preferences or default categories
    cats.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = capitalizeFirstLetter(category);
        select.appendChild(option);
    });

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Fetch News';

    categoryForm.appendChild(label);
    categoryForm.appendChild(select);
    categoryForm.appendChild(button);

    formContainer.appendChild(categoryForm);


    const preferencesBtn = document.getElementById('preferencesBtn');
    const preferencesModal = document.getElementById('preferencesModal');
    const closeBtn = preferencesModal.querySelector('.close-btn');
    const preferencesForm = document.getElementById('preferencesForm');
    const categoryCheckboxes = document.getElementById('categoryCheckboxes');
    const categorySelect = document.getElementById('category');

    // Dynamically populate checkboxes for each category
    allCategories.forEach(category => {
        const checkbox = document.createElement('input');
        const checkboxId = `categoryCheckbox_${category}`;
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
        checkbox.name = 'categories';
        //checkbox.name = checkboxId;
        checkbox.value = category;
        //checkbox.checked = true; // Default to checked
        checkbox.checked = userCategories ? userCategories.includes(category) : true;

        const label = document.createElement('label');
        label.textContent = category;
        label.setAttribute('for', checkboxId);

        categoryCheckboxes.appendChild(checkbox);
        categoryCheckboxes.appendChild(label);
        categoryCheckboxes.appendChild(document.createElement('br'));
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === preferencesModal) {
            preferencesModal.style.display = 'none';
        }
    });
    
    // Function to open/close preferences modal
    function togglePreferencesModal() {
        preferencesModal.style.display = preferencesModal.style.display === 'block' ? 'none' : 'block';
    }

    // Open/close preferences modal
    preferencesBtn.addEventListener('click', togglePreferencesModal);
    closeBtn.addEventListener('click', togglePreferencesModal);

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
            const filteredTitle = headline.title.replace(/\s*-\s*.+$/, '');
            title.textContent = filteredTitle;

            const description = document.createElement('p');
            description.className = 'card-description';
            description.textContent = headline.description;

            const content = document.createElement('p');
            content.className = 'card-content';
            const thecontent = headline.content;
            //const filteredString = thecontent.replace(/\s*\[.*?chars\]/, '');
            const filteredString = thecontent ? thecontent.replace(/\s*\[.*?chars\]/, '') : '';

            content.textContent = filteredString;

            const authorDateContainer = document.createElement('div');
            authorDateContainer.className = 'card-author-date';

            const author = document.createElement('span');
            author.className = 'card-author';
            author.textContent = `By ${headline.author || 'Unknown Author'}`;

            const date = document.createElement('span');
            date.className = 'card-date';
            date.textContent = new Date(headline.publishedAt).toLocaleDateString();

            const source = document.createElement('span');
            source.className = 'card-source';
            source.textContent = `Source: ${headline.source ? headline.source.name : 'Unknown Source'}`;

            authorDateContainer.appendChild(author);
            authorDateContainer.appendChild(date);
            //authorDateContainer.appendChild(source);

            link.appendChild(image);

            card.appendChild(link);
            card.appendChild(typeButton);
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(content);
            card.appendChild(authorDateContainer);
            card.appendChild(source);

            newsList.appendChild(card);
        });
    }

    // Add event listener to the category selector form
    categoryForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        const selectedCategory = document.getElementById('category').value;
        fetchNews(selectedCategory);
    });

    // Initial fetch when the page loads
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

});
/*
// Function to save user preferences to local storage
function saveUserPreferences(preferences) {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));   
}
*/

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}