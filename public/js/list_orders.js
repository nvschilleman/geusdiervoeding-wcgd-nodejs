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

    if (params.sortby != 'trip'){
        $( "div#stopNumCol" ).hide( "slow" );
        $( "div#stopNumColHead" ).hide( "slow" );
    }else{
        $( "div#stopNumCol" ).show( "slow" );
        $( "div#stopNumColHead" ).show( "slow" );
    }

    console.log(params);
    console.log(options);

    $("button#clearAllFilters").on('click', function(e) {
        e.preventDefault();
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
        }
    });

    function applyFilter() {
        date = options.date.format('YYYYMMDD');
        window.location.href='/list/orders?date='+date+'&sortby='+options.sortby+'&status='+options.status+'&substate='+options.substate;
    }
});




