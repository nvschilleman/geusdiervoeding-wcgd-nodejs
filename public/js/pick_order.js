$(function() {

    let filter_url = sessionStorage.getItem('filterUrl');
    if(!filter_url){
        filter_url = '/list/orders';
    }

    sessionStorage.setItem('returnUrl', filter_url);

    $('#orderListUrlBtn').on( "click", function(e) {
        e.preventDefault();
        window.location.href=filter_url;
      });

    let order_id = $('span#order_id').text();
    let checkbox = $("input[type='checkbox'].form-check-input");

    checkbox.change(function() {
        if(checkbox.length == checkbox.filter(":checked").length){
            Swal.fire({
                title: 'Alle artikelen afgevinkt',
                text: 'Wil je de verpakkingslabels printen?',
                showDenyButton: true,
                showCancelButton: true,
                cancelButtonText: 'Annuleren',
                confirmButtonText: 'Ja',
                denyButtonText: 'Terug naar orderlijst',
                allowEscapeKey: false,
                allowOutsideClick: false
              }).then((result) => {
                if (result.isConfirmed) {
                    getOrder(order_id);
                } else if (result.isDenied) {
                    window.location.href=filter_url;
                }
              })
        }

        if (this.checked) {          
          $(this).closest('div').find('p.fw-bold').addClass('text-decoration-line-through text-muted');
        } else {            
            $(this).closest('div').find('p.fw-bold').removeClass('text-decoration-line-through text-muted');
        }
      });



    $.ajax({
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.getJSON('wp_CustomAuth').token);
        },
        url: 'https://'+self.location.host+'/get/packing_slip_data/'+order_id,
        data: {},
        success: packingSlipData,
        dataType: 'json'
    });


    
});

function packingSlipData(res){

    var checkbox = $("input[type='checkbox'].form-check-input");
    var order_status = res.order.order_status;

    if (order_status == 'Ingepakt'){
        $(checkbox).prop("checked", true);
        $(checkbox).closest('div').find('p.fw-bold').addClass('text-decoration-line-through text-muted');
    }

    if ( res.order.delivery_method == 'Afhaalorder' ){
        $('span#delivery_method').removeClass( 'bg-dark' ).addClass( "bg-warning text-dark" );
    }
    $('span#delivery_date').text(res.order.delivery_date);
    $('span#order_status').text(order_status);
    $('span#delivery_method').text(res.order.delivery_method);

    var no_stock_select = res.order.no_stock_select;
    if( no_stock_select == ''){
        no_stock_select = 'Geen voorkeur'
    }
    if( no_stock_select == 'Contact'){
        no_stock_select = 'Contact opnemen'
    }

    $('p#nostockselect').text(no_stock_select);

    $('span#quantities').text(res.order.order_quantity);
    $('span#order_weight').text(res.order.order_weight);

    if(res.child_order){
        $('span#child_quantities').text(res.child_order.order_quantity);
        $('span#child_order_weight').text(res.child_order.order_weight); 
        $('span#combined_quantities').text(res.totals.quantity);
        $('span#combined_order_weight').text(res.totals.weight);
    }  
}


// function checkProductStock(sku){
//     Swal.fire({
//         title: 'Product zoeken...',
//         allowEscapeKey: false,
//         allowOutsideClick: false,
//         showConfirmButton: false,
//         didOpen: () => {
//             Swal.showLoading();
//             $.ajax({
//                 type: "GET",
//                 url: 'https://geusdiervoeding.nl/api/json.php?sku='+sku,
//                 dataType: 'json',
//                 success: function(data) {
//                     window.location.href = '/view/product/'+sku;  
//                 },   
//                 error:function (xhr, ajaxOptions, thrownError){
//                         Swal.fire({
//                             title: 'HTTP Error '+xhr.status,
//                             html: 'Geen product gevonden met opgegeven SKU!',
//                             showDenyButton: false,
//                             showCancelButton: false,
//                             confirmButtonText: 'Ok',
//                             allowEscapeKey: false,
//                             allowOutsideClick: false
//                         }).then((result) => {
//                             if (result.isConfirmed) {
//                                 $("#input_productsku").val('');
//                             }
//                         });
//                 }      
//             });
//         }
//     })
// }