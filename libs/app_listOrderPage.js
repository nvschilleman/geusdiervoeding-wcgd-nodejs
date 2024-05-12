var appConfig = require('../config.json'),
    axios = require('axios'),
    moment = require('moment');

module.exports = function(request,cb) {
    
    console.log('getOrderList');

    console.log(request.query.date);

    let params = {date: request.query.date, sortby: request.query.sortby, status:request.query.status, substate:request.query.substate};

    console.log(params);

    if (params.date == undefined && params.date == null) {
        var date = new Date();
        params.date = moment(date).format('YYYYMMDD'); 
    }

    var sortbyparam = '&sortby='+params.sortby;

    if (params.sortby == undefined && params.sortby == null || params.sortby == '') {
        sortbyparam = '';     
    }

    var statusparam = '&status='+params.status;

    if (params.status == undefined && params.status == null || params.status == '') {
        statusparam = '';     
    }

    var substateparam = '&substate='+params.substate;

    if (params.substate == undefined && params.substate == null || params.substate == '') {
        substateparam = '';     
    }

    console.log('ApiUrl: '+appConfig.wcgd.list_order_endpoint + '?date=' + params.date + sortbyparam + statusparam + substateparam);

    axios.get(appConfig.wcgd.list_order_endpoint + '?date=' + params.date + sortbyparam + statusparam + substateparam, {
        "headers": {
            'Authorization': appConfig.wordpress.static_token
        }
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


