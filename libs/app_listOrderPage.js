var appConfig = require('../config.json'),
    axios = require('axios'),
    moment = require('moment');

module.exports = function(request,cb) {
    
    console.log('getOrderList');

    let params = {date: request.query.date, sortby: request.query.sortby, status:request.query.status, substate:request.query.substate, surname:request.query.surname};

    if (params.date == undefined && params.date == null || params.date == '') {
        delete params.date;
    }

    if (params.sortby == undefined && params.sortby == null || params.sortby == '') {
        delete params.sortby;   
    }

    if (params.status == undefined && params.status == null || params.status == '') {
        delete params.status;    
    }

    if (params.substate == undefined && params.substate == null || params.substate == '') {
        delete params.substate;    
    }

    if (params.surname == undefined && params.surname == null || params.surname == '') {
        delete params.surname;    
    }

    axios.get(appConfig.wcgd.list_order_endpoint, {
        headers: {
            'Authorization': appConfig.wordpress.static_token
        },
        params: params
    })
    .then(function (response) {
        console.log('ListOrdersSuccess');
        // console.log(response.data);
        cb(null, response.data);
    })
    .catch(function (error) {
        console.log('ListOrdersError');
        cb(error.response.data, null);
    });
    // cb(null,null);
}


