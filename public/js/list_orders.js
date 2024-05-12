$(function() {
    let options = {date: '', substate: '', status: '', sortby: ''};
    const params = {date: getUrlParameter('date'), sortby: getUrlParameter('sortby'), substate: getUrlParameter('substate'), status: getUrlParameter('status') };

    console.log(params);

    if (!params.date){
        options.date = moment();
    }else{
        options.date = moment(params.date, 'YYYYMMDD');
    }
    if (params.sortby){
        sortby = $("#sortbyDropMenu li a#"+params.sortby).html();
        $("#sortbyDropBtn").text(sortby);
        options.sortby = params.sortby;
    }
    if (params.substate){
        substate = $("#substateDropMenu li a#"+params.substate).html();
        $("#substateDropBtn").text(substate);
        options.substate = params.substate;
    }
    if (params.status){
        order_status = $("#statusDropMenu li a#"+params.status).html();
        $("#statusDropBtn").text(order_status);
        options.status = params.status;
    }

    console.log(params);
    console.log(options);


    
    $("#substateDropMenu li a").on('click', function(e) {      
        e.preventDefault(); // cancel the link behaviour
        var selText = $(this).html();
        options.substate = $(this).attr('id');
        // console.log(options);
        // $("#substateDropBtn").text(selText);
        applyFilter();
      });

    $("#statusDropMenu li a").on('click', function(e) {      
        e.preventDefault(); // cancel the link behaviour
        var selText = $(this).html();
        options.status = $(this).attr('id');
        // console.log(options);
        // $("#statusDropBtn").text(selText);
        applyFilter();
      });

    $("#sortbyDropMenu li a").on('click', function(e) {      
        e.preventDefault(); // cancel the link behaviour
        var selText = $(this).html();
        options.sortby = $(this).attr('id');
        // console.log(options);
        // $("#sortbyDropBtn").text(selText);
        applyFilter();
      });

    // $("input#datepicker").change(function() {      

    // });

      $('#datepicker').datepicker({
        format: 'dd-mm-yyyy',
        uiLibrary: 'bootstrap5',
        value: options.date.format('DD-MM-YYYY'),
        change: function (e) {
            console.log(e);
            var input_date = $(this).val();
            input_date = moment(input_date, 'DD-MM-YYYY');
            console.log('OptionsDate '+ options.date.format('YYYYMMDD'));
            console.log('inputDate '+ input_date.format('YYYYMMDD'));
            if(input_date.format('YYYYMMDD') !== options.date.format('YYYYMMDD')){
                options.date = input_date;
                applyFilter();
            }

            // options.date = moment(input_date, 'DD-MM-YYYY');
            // applyFilter();
        }
    });

    function applyFilter() {
        date = options.date.format('YYYYMMDD');
        window.location.href='/list/orders?date='+date+'&sortby='+options.sortby+'&status='+options.status+'&substate='+options.substate;
    }

    // console.log('docReady');
    // $.ajax({
    //     type: "GET",
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.getJSON('wp_CustomAuth').token);
    //     },
    //     url: 'https://'+self.location.host+'/get/orderlist?date=20240302&substate=afhaal',
    //     success: listOrders,
    //     dataType: 'json'
    // });
});

function listOrders(res){
    console.log('listOrders');
    console.log(res);
    // if(res.success) {
        // console.log('UserData');
        // console.log(Cookies.getJSON('wp_CustomAuth'));
        // if(Cookies.getJSON('wp_CustomAuth').user_role !== 'administrator'){
        //     flushSession(true);
        // }
    // }
    // else {
        // flushSession(true);
    // }
}

function flushSession(isTokenError) {
    Cookies.remove('wp_CustomAuth');
    if(isTokenError) { window.location.href="/signin?s=1"; } // s=1 token failure (alert signin header notification)
    else{ window.location.href = "/signin"; }
}


