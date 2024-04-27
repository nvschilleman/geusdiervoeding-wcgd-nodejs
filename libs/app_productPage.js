var appConfig = require('../config.json'),
    axios = require('axios');

module.exports = function(request,cb) {
    // cb(null,null);
    console.log('getProductdata');
    // console.log(request.params);


    axios.get(appConfig.wcgd.product_api_endpoint + request.params.productSku, {

    })
    .then(function (response) {
        console.log('DTA');
        // console.log(response);
        // console.log(response.data);
        cb(null, response.data);
    })
    .catch(function (error) {
        console.log('ERR');
        cb(error.response.data, null);
    });
}


