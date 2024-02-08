const axios = require('axios');
require('dotenv').config();

const getNews = async (req, res) => {
    try {
        const apiKey = process.env.NEWSAPI_KEY;
        const country = 'us'
        const category = req.query.category || 'general';
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`;

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