var appConfig = require('../config.json'),
    axios = require('axios'),
    moment = require('moment');

module.exports = function(request,cb) {
    
    console.log('getOrderList');

    console.log(request.query.date);

    let params = {date: request.query.date, substate:request.query.substate};

    if (params.date == undefined && params.date == null) {
        var date = new Date();
        params.date = moment(date).format('YYYYMMDD'); 
    }

    var substateparam = '&substate='+params.substate;

    if (params.substate == undefined && params.substate == null) {
        substateparam = '';     
    }

    console.log('ApiUrl: '+appConfig.wcgd.list_order_endpoint + '?date=' + params.date + substateparam);

    axios.get(appConfig.wcgd.list_order_endpoint + '?date=' + params.date + substateparam, {
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


