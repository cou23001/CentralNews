const axios = require('axios');
require('dotenv').config();

const getNews = async (req, res) => {
    try {
        const apiKey = process.env.NEWSAPI_KEY;
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

        const response = await axios.get(apiUrl);
        const news = response.data.articles;

        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getNews,
};