document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch news based on the selected category
    async function fetchNews(category) {
        try {
            const response = await fetch(`/api/news?category=${category}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch news: ${response.statusText}`);
            }
            const news = await response.json();
            // Filter out news with content "[Removed]" and display the first 7 headlines
            const filteredNews = news.filter(article => article.content !== "[Removed]");

            displayNews(filteredNews,category);
        } catch (error) {
            console.error(error);
            // Handle errors, e.g., display an error message to the user
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
    const categoryForm = document.getElementById('categoryForm');
    categoryForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        const selectedCategory = document.getElementById('category').value;
        fetchNews(selectedCategory);
    });

    // Initial fetch when the page loads
    fetchNews('general');
});

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
