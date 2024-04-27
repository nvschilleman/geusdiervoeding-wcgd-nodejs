var appConfig = require('../config.json'),
    axios = require('axios');

module.exports = function(request,cb) {
    // cb(null,null);
    console.log('printLabel');
    console.log(request);
    axios.post(appConfig.zpl_printer.print_endpoint, {
        printer:request.printer_id, 
        label: request.label_id,
        data: request.data
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


