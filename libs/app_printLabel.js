var appConfig = require('../config.json'),
    axios = require('axios');

function newAbortSignal(timeoutMs) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    return abortController.signal;
    }

module.exports = function(request,cb) {
    console.log('printLabel');

    if (request.hasOwnProperty('tripNumber')){
        console.log('routeOrder');
        label_id = appConfig.zpl_printer.delivery_label_id;
    }else{
        console.log('localPickupOrder');
        label_id = appConfig.zpl_printer.localpickup_label_id;
    }

    const request_body = {
        printer_id: appConfig.zpl_printer.printer_id,
        label_id: label_id,
        data: request
    }

    axios.post(appConfig.zpl_printer.print_endpoint, { request_body }, {
        timeout: 4500,
        signal: newAbortSignal(4000)
    })

    .then(function (response) {
        console.log('printResponse');
        console.log(response.data);
        cb(null, response.data);
    })
    .catch(function (error) {
        if(!error.response){
            error.response = {data:{error: {errno:504, message: "ZPL-REST connection timeout"}}};
        }
        cb(error.response.data, null);
    });
}


