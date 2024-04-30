var appConfig = require('../config.json'),
    axios = require('axios');

function newAbortSignal(timeoutMs) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    return abortController.signal;
    }

module.exports = function(request,cb) {
    console.log('printLabel');
    console.log(request);
    axios.post(appConfig.zpl_printer.print_endpoint, {
        printer:request.printer_id, 
        label: request.label_id,
        data: request.data },
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


