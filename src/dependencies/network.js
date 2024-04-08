const axios = require('axios');

module.exports = axios.create({
    baseURL: 'https://api.lib.social/api/',
    timeout: 1000,
})
