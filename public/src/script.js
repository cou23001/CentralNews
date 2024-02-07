// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/news')
        .then(response => response.json())
        .then(news => {
            displayNews(news.slice(0, 5)); // Display only the first 5 headlines
        })
        .catch(error => console.error(error));

    function displayNews(news) {
        const newsList = document.getElementById('newsList');

        news.forEach(headline => {
            const listItem = document.createElement('li');
            listItem.textContent = headline.title;
            newsList.appendChild(listItem);
        });
    }
});
