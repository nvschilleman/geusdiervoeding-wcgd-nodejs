var appConfig = require('../config.json'),
    axios = require('axios');

function newAbortSignal(timeoutMs) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    return abortController.signal;
    }

module.exports = function(request,cb) {
    if (request.hasOwnProperty('tripNumber')){
        label_id = appConfig.zpl_printer.delivery_label_id;
    }else{
        label_id = appConfig.zpl_printer.localpickup_label_id;
    }

    axios.post(appConfig.zpl_printer.print_endpoint, {
        printer:appConfig.zpl_printer.printer_id, 
        label:label_id,
        data: request },
        {
        timeout: 4500,
        signal: newAbortSignal(4000)
    })

    .then(function (response) {
        cb(null, response.data);
    })
    .catch(function (error) {
        if(!error.response){
            error.response = {data:{error: {errno:504, message: "ZPL-REST connection timeout"}}};
        }
        cb(error.response.data, null);
    });
}


