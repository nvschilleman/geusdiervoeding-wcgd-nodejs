$(function() {
    
    let filter_url = sessionStorage.getItem('filterUrl');
    if(!filter_url){
        filter_url = '/list/orders';
    }

    sessionStorage.setItem('returnUrl', filter_url);

    let options = {date: '', substate: '', status: '', sortby: '', surname: ''};
    var datepicker_value;
    const params = {date: getUrlParameter('date'), sortby: getUrlParameter('sortby'), substate: getUrlParameter('substate'), status: getUrlParameter('status'), surname: getUrlParameter('surname') };
    
    if (!params.date){
        options.date = moment(19700101, 'YYYYMMDD');
        datepicker_value = '';
    }else{
        options.date = moment(params.date, 'YYYYMMDD');
        datepicker_value = options.date.format('DD-MM-YYYY');    
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
    if (params.surname){
        // surname = $("input#surname").val();
        $("input#surname").val(params.surname);
        options.surname = params.surname;
    }

    if (params.sortby != 'trip'){
        $( "div#stopNumCol" ).hide( "slow" );
        $( "div#stopNumColHead" ).hide( "slow" );
    }else{
        $( "div#stopNumCol" ).show( "slow" );
        $( "div#stopNumColHead" ).show( "slow" );
    }

    $("button#clearAllFilters").on('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('filterUrl');
        window.location.href='/list/orders';
    });
    
    $("#substateDropMenu li a").on('click', function(e) {      
        e.preventDefault();
        options.substate = $(this).attr('id');
        applyFilter();
      });

    $("#statusDropMenu li a").on('click', function(e) {      
        e.preventDefault(); 
        var selText = $(this).html();
        options.status = $(this).attr('id');
        // console.log(options);
        // $("#statusDropBtn").text(selText);
        applyFilter();
      });

    $("#sortbyDropMenu li a").on('click', function(e) {      
        e.preventDefault(); 
        var selText = $(this).html();
        options.sortby = $(this).attr('id');
        // console.log(options);
        // $("#sortbyDropBtn").text(selText);
        applyFilter();
      });

      $("button#doSearchBtn").on('click', function(e) {      
        e.preventDefault();
        applyFilter();
      });

      $('#datepicker').datepicker({
        format: 'dd-mm-yyyy',
        uiLibrary: 'bootstrap5',
        value: datepicker_value,
        change: function (e) {
            console.log(e);
            var input_date = $(this).val();
            input_date = moment(input_date, 'DD-MM-YYYY');
            if(input_date.format('YYYYMMDD') !== options.date.format('YYYYMMDD')){
                options.date = input_date;
                applyFilter();
            }
        }
    });

    function applyFilter() {
        surname = $("input#surname").val();
        date = options.date.format('YYYYMMDD');
        // Temporary fix for datepicker
        if(date == 19700101){
            date = ''
        }
        filter_url = '/list/orders?date='+date+'&sortby='+options.sortby+'&status='+options.status+'&substate='+options.substate+'&surname='+surname;
        sessionStorage.setItem('filterUrl', filter_url);
        window.location.href=filter_url;
    }
});




