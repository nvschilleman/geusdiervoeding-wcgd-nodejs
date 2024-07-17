var appConfig = require('../config.json'),
    axios = require('axios');

module.exports = function(request,cb) {
    
    console.log('pickOrderPage');

    axios.get(appConfig.wcgd.pick_order_endpoint + request.params.orderId, {
        "headers": {
            'Authorization': appConfig.wordpress.static_token
        }
    })
    .then(function (response) {
        console.log('pickOrderSuccess');
        // console.log(response.data);
        cb(null, response.data);
    })
    .catch(function (error) {
        console.log('pickOrderError');
        // console.log(error.response.data);
        cb(error.response, null);
    });
    // cb(null,null);
}


