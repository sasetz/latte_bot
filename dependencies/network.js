const axios = require('axios');
const { api_url, request_timeout } = require('../config/discord.json');

module.exports = axios.create({
    baseURL: api_url,
    timeout: request_timeout,
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0',
        'Origin': 'https://test-front.mangalib.me',
    }
});
