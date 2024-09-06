var appConfig = require('../config.json'),
axios = require('axios');

module.exports = function(request,cb) {
    // cb(null,null);
    console.log('postOrderNote');

    axios.post(appConfig.wcgd.orders_endpoint + request.params.orderId + '/notes', {
        added_by_user:true, 
        note: request.body.note,
        customer_note: request.body.customer_note,
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
