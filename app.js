var express = require('express'),   
    app = express(),
    hbs = require('express-handlebars'),
    moment = require('moment'),
    bodyParser = require('body-parser'),
    app_userValidate = require('./libs/app_userValidate.js'),
    app_userAuth = require('./libs/app_userAuth.js'),
    app_userHome = require('./libs/app_userHome.js');
    app_productPage = require('./libs/app_productPage.js');
    app_orderPage = require('./libs/app_orderPage.js');
    app_pickOrderPage = require('./libs/app_pickOrderPage.js');
    app_packingSlipData = require('./libs/app_packingSlipData.js');
    app_updateOrder = require('./libs/app_updateOrder.js');
    app_listOrderPage = require('./libs/app_listOrderPage.js');
    app_markCollected = require('./libs/app_markCollected.js');
    app_printLabel = require('./libs/app_printLabel.js');

app.engine( 'hbs', hbs.engine( { 
    extname: 'hbs', 
    defaultLayout: 'main', 
    helpers: require('./libs/handlebars-helpers.js').helpers,
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
  } ) );

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
 

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/order', function (req, res) {
    res.render('order');
});

app.get('/scan/product', function (req, res) {
    res.render('scan_product');
});

app.get('/scan/order', function (req, res) {
    res.render('scan_order');
});

app.get('/signin', function (req, res) {
    // res.render('signin');
    res.render('signin', {layout: 'signin_layout'});
});
 
app.listen(3000);

app.post('/user/auth', function (req, res) {
    app_userAuth(req.body, function(authError,authSuccess) {
        if(!authError) {
            res.json(authSuccess);
        }
        else {
            res.json(authError);
        }
    });
});

app.get('/user/home', app_userValidate, function (req, res) {
    app_userHome(req.headers.authorization, function(homeError, homeSuccess){
        res.json({
            success: true,
            status: 200
        });
    });
});

app.get('/view/product/:productSku', function (req, res) {
    app_productPage(req, function(productPageError, productPageSuccess){
        
        if(!productPageError) {
            console.log(productPageSuccess);
            res.render('product', {ProductName: productPageSuccess.name, ProductId: productPageSuccess.id, atumLocations: productPageSuccess.atumLocations, listExists:true});
        } else {
            // res.json(productPageError);
            res.render('product', {error:true});
            console.log('getProductError');
        }
    });
});

app.get('/view/order/:orderId', function (req, res) {
    app_pickOrderPage(req, function(pickOrderError, pickOrderSuccess){
        
        if(!pickOrderError) {
            var lineItems = pickOrderSuccess.line_items.sort((a, b) => a.atum_location.localeCompare(b.atum_location, undefined, { numeric: true, sensitivity: 'base'}));
            if(pickOrderSuccess.child_order){
                var childLineItems = pickOrderSuccess.child_order.sort((a, b) => a.atum_location.localeCompare(b.atum_location, undefined, { numeric: true, sensitivity: 'base'}));
            }
            res.render('pick_order', {orderId: pickOrderSuccess.id, customerInfo: pickOrderSuccess.billing, customerNote: pickOrderSuccess.customer_note, orderItems: lineItems, childOrderId: pickOrderSuccess.child_order_id, childOrderCustomerNote: pickOrderSuccess.child_order_customer_note, childOrderItems: childLineItems});
        } else {
            // res.json(productPageError);
            res.render('pick_order', {error:pickOrderError});
        }
    });
});

app.get('/get/packing_slip_data/:orderId', app_userValidate, function (req, res) {
    app_packingSlipData(req, function(dataError, dataSuccess){
        if(!dataError) {
            res.json(dataSuccess);
            console.log('getDataSuccess');
            console.log(dataSuccess);
        }
        else {
            res.json(dataError);
            console.log('getDataError');
        }
    });
});



app.get('/list/orders', function (req, res) {
    app_listOrderPage(req, function(listOrdersError, listOrders){
        if(!listOrdersError) {
            var hasOrders = true;
            
            if (0 === listOrders.length){
                hasOrders = false;
            }

            console.log(listOrders);
            res.render('list_orders', {hasOrders: hasOrders, orders: listOrders});
  
        } else {
            res.json(listOrdersError);
            // res.render('product', {error:true});
            console.log('listOrdersError');
        }
    });
});

app.post('/get/order', app_userValidate, function (req, res) {
    app_orderPage(req, function(orderError, orderSuccess){
        if(!orderError) {
            res.json(orderSuccess);
            console.log('getOrderSuccess');
            console.log(orderSuccess);
        }
        else {
            res.json(orderError);
            console.log('getOrderError');
        }
    });
});

app.post('/update/order', app_userValidate, function (req, res) {
    app_updateOrder(req, function(updateError, updateSuccess){
        if(!updateError) {
            res.json(updateSuccess);
            console.log('UPDATE_SUCCESS')
        }
        else {
            res.json(updateError);
            console.log(updateError);
            console.log('UPDATE_ERROR');
        }
    });
});

app.post('/mark_collected/order', app_userValidate, function (req, res) {
    app_markCollected(req, function(markCollectedError, markedCollectedSuccess){
        if(!markCollectedError) {
            res.json(markedCollectedSuccess);
            console.log('MARK_COLLECTED_SUCCESS')
        }
        else {
            res.json(markCollectedError);
            console.log('MARK_COLLECTED_ERROR');
        }
    });
});

app.post('/label/print', function (req, res) {
    app_printLabel(req.body, function(printError,printSuccess) {
        if(!printError) {
            console.log('printCallbackSuccess');
            res.json(printSuccess);
        }
        else {
            res.json(printError);
        }
    });
});
