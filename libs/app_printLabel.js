var appConfig = require('../config.json'),
    axios = require('axios');



function newAbortSignal(timeoutMs) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    
    return abortController.signal;
    }

module.exports = function(request,cb) {
    // cb(null,null);
    console.log('printLabel');
    console.log(request);
    axios.post(appConfig.zpl_printer.print_endpoint, {
        printer:request.printer_id, 
        label: request.label_id,
        data: request.data },
        {
            timeout: 10000,
            signal: newAbortSignal(5000)
    })

    .then(function (response) {
        // console.log(response.data);
        cb(null, response.data);
    })
    .catch(function (error) {
        console.log(error.response);
        cb(error.response, null);
    });
}


