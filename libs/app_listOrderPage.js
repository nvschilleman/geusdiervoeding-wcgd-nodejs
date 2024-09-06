var appConfig = require('../config.json'),
    axios = require('axios'),
    moment = require('moment');

module.exports = function(request,cb) {
    
    console.log('getOrderList');

    let params = {date: request.query.date, sortby: request.query.sortby, status:request.query.status, substate:request.query.substate};

    // console.log(params);

    if (params.date == undefined && params.date == null || params.date == '') {
        delete params.date;
    }

    // var sortbyparam = '&sortby='+params.sortby;

    if (params.sortby == undefined && params.sortby == null || params.sortby == '') {
        delete params.sortby;   
    }

    // var statusparam = '&status='+params.status;

    if (params.status == undefined && params.status == null || params.status == '') {
        delete params.status;    
    }

    // var substateparam = '&substate='+params.substate;

    if (params.substate == undefined && params.substate == null || params.substate == '') {
        delete params.substate;    
    }

    // console.log('ApiUrl: '+appConfig.wcgd.list_order_endpoint + '?date=' + params.date + sortbyparam + statusparam + substateparam);

    // axios.get(appConfig.wcgd.list_order_endpoint + '?date=' + params.date + sortbyparam + statusparam + substateparam, {
    //     "headers": {
    //         'Authorization': appConfig.wordpress.static_token
    //     }
    // })
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


