var appConfig = require('../config.json'),
    axios = require('axios');

module.exports = function(authBearerToken,cb) {
    cb(null,null);
    console.log('Home');
    // axios.get(appConfig.wcgd.order_endpoint + '219028', {
    //     "headers": {
    //         'Authorization': authBearerToken
    //     }
    // })
    // .then(function (response) {
    //     console.log(response.data);
    //     cb(null, response);
    // })
    // .catch(function (error) {
    //     console.log(error.response.data);
    //     cb(error, null);
    // });
}


