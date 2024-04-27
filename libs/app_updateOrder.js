var appConfig = require('../config.json'),
    axios = require('axios');

module.exports = function(request,cb) {
    // cb(null,null);
    console.log('updateOrder');

    axios.post(appConfig.wcgd.update_order_endpoint, {
        id:request.body.id, 
        boxAmount: request.body.boxAmount,
        dryAmount: request.body.dryAmount,
        packedBy: request.body.packedBy
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


