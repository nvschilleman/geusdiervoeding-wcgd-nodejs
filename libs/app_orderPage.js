var appConfig = require('../config.json'),
    axios = require('axios');

module.exports = function(request,cb) {
    // cb(null,null);
    console.log('OrderPage');

    axios.get(appConfig.wcgd.order_endpoint + request.body.id, {
        "headers": {
            'Authorization': request.headers.authorization
        }
    })
    .then(function (response) {
        // console.log(response.data);
        cb(null, response.data);
    })
    .catch(function (error) {
        // console.log(error.response.data);
        cb(error.response.data, null);
    });
}


