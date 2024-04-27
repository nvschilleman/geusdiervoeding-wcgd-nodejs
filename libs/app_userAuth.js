var appConfig = require('../config.json'),
    axios = require('axios');

module.exports = function(params,cb) {
    axios.post(appConfig.wordpress.token_auth_url, {
        username: params.username,
        password: params.password
    })
    .then(function (response) {
        console.log(response.data);
        cb(null, response.data);
    })
    .catch(function (error) {
        console.log(error.response.data);
        cb(error.response.data, null);
    });
}
