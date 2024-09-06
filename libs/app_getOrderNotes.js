const dayjs = require('dayjs'),
      locale_nl = require('dayjs/locale/nl');

var appConfig = require('../config.json'),
    axios = require('axios'),
    relativeTime = require('dayjs/plugin/relativeTime');

const filterResponse = (array, predicate) => {
    let end = 0;

    for (let i = 0; i < array.length; i++) {
        const obj = array[i];

        if (predicate(obj)) {
            array[end++] = obj;
        }
    }

    array.length = end;
};

module.exports = function(request,cb) {
    // cb(null,null);

    axios.get(appConfig.wcgd.orders_endpoint + request.params.orderId + '/notes', {
        "headers": {
            'Authorization': request.headers.authorization
        }
    })
    .then(function (response) {

        dayjs.extend(relativeTime);
        dayjs.locale(locale_nl);
        const toDelete = new Set(['WooCommerce','Geusdiervoeding API']);
        
        filterResponse(response.data, obj => !toDelete.has(obj.author));

        response.data.forEach(element => { 
            element.date_created = dayjs(element.date_created).fromNow();
          });
         
    
        cb(null, response.data);
    })
    .catch(function (error) {
        // console.log(error.response.data);
        cb(error.response.data, null);
    });
}


