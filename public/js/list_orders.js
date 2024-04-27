$(function() {
    let defaults = {substate: 'all', status: 'any'}
    const params = {substate: getUrlParameter('substate'), status: getUrlParameter('status'), date: getUrlParameter('date')};

    console.log(params);

    var test = $("#substateDropMenu li a#"+params.substate).html();

    console.log(test);
    
    $("#substateDropMenu li a").on('click', function(e) {      
        e.preventDefault(); // cancel the link behaviour
        var selText = $(this).html();
        defaults.substate = $(this).attr('id');
        console.log(defaults);
        $("#substateDropBtn").text(selText);
      });

    $("#statusDropMenu li a").on('click', function(e) {      
        e.preventDefault(); // cancel the link behaviour
        var selText = $(this).html();
        defaults.status = $(this).attr('id');
        console.log(defaults);
        $("#statusDropBtn").text(selText);
      });

      $('#datepicker').datepicker({
        format: 'dd-mm-yyyy',
        uiLibrary: 'bootstrap5'

    });

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


