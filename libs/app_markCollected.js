var appConfig = require('../config.json'),
    axios = require('axios');

module.exports = function(request,cb) {
    // cb(null,null);
    console.log('markCollected');

    axios.post(appConfig.wcgd.mark_collected_order_endpoint, {
        id:request.body.id, 
        user: request.body.user
    }, {
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


