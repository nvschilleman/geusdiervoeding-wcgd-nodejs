$(function() {

    const url = new URL(window.location.href);
    const order_id = $('span#order_id').text();
    const OrderNotesUl = $("ul#order_notes_ul").clone();
    const orderSubstate = $('input#orderSubstate').val();

    let filter_url = sessionStorage.getItem('filterUrl');
    if(!filter_url){
        filter_url = '/list/orders';
    }

    let view = getUrlParameter('view');
    
    if(!view){
        $( "div#quantity-inputs-container" ).hide();
    }
    if(view == 'packages'){
        $( "div#order-items-container" ).hide();
        $( "div#quantity-inputs-container" ).show();
        $("#orderActionBtn").text('Naar pakbon');
    }

    sessionStorage.setItem('returnUrl', filter_url);

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

    getOrderNotes(order_id);

    // $('a#order_notes_btn').on( "click", function(e) {
    //     e.preventDefault();
    //     if ($('li#notes_loading').length){
    //         $.ajax({
    //             type: "GET",
    //             beforeSend: function (xhr) {
    //                 xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.getJSON('wp_CustomAuth').token);
    //             },
    //             url: 'https://'+self.location.host+'/get/order_notes/'+order_id,
    //             data: {},
    //             success: renderNotes,
    //             dataType: 'json'
    //         });
    //     }
    //   });


    $('#orderListUrlBtn').on( "click", function(e) {
        e.preventDefault();
        window.location.href=filter_url;
      });
    $('#orderActionBtn').on( "click", function(e) {
        e.preventDefault();
        if(getUrlParameter('view') == 'packages'){
            viewPackingSlip(url);
        }else{
            viewPackagesForm(url);
        }
      });
    $('#postOrderNoteBtn').on( "click", function(e) {
    e.preventDefault();
    postOrderNote(order_id, OrderNotesUl);
    });
    
    const orderStr = localStorage.getItem(order_id);
    let order = JSON.parse(orderStr);

    if(order === null){
        console.log('getOrderCalled');
        order = getOrder(order_id);
    }else{
        orderData(order);
    }

    var swalDenyText = 'Terug naar orderlijst';
    if(orderSubstate === 'afhaal'){
        swalDenyText = 'Order afgehaald melden';
    }

    $('#dry_quantity_input').niceNumber({autoSize:false});
    $('#box_quantity_input').niceNumber({autoSize:false});
    let checkbox = $("input[type='checkbox'].form-check-input.packing-list");

    checkbox.change(function() {
        if(checkbox.length == checkbox.filter(":checked").length){
            Swal.fire({
                title: 'Alle artikelen afgevinkt',
                text: 'Wil je de verpakkingslabels printen?',
                showDenyButton: true,
                showCancelButton: true,
                cancelButtonText: 'Annuleren',
                confirmButtonText: 'Ja',
                denyButtonText: swalDenyText,
                allowEscapeKey: false,
                allowOutsideClick: false
              }).then((result) => {
                if (result.isConfirmed) {
                    viewPackagesForm(url);
                } else if (result.isDenied) {
                    if(orderSubstate === 'afhaal'){
                        collectedOrder(order_id);
                    }else{
                        window.location.href=filter_url;
                    }
                }
              })
        }

        if (this.checked) {          
          $(this).closest('div').find('p.fw-bold').addClass('text-decoration-line-through text-muted');
        } else {            
            $(this).closest('div').find('p.fw-bold').removeClass('text-decoration-line-through text-muted');
        }
      });

    $(".form-setquantities").submit(function(event) {

        event.preventDefault();

        var dry = Number($('#dry_quantity_input').val());
        var box = Number($('#box_quantity_input').val());
        var labelQuantity = dry+box;

        if ( labelQuantity < 1 ){
            Swal.fire({
                title: 'Geen aantallen ingevoerd!',
                html: 'Er zijn geen aantallen ingevoerd, pas de aantallen aan en probeer opnieuw.',
                icon: 'error'
            });
        }else{
            prepareOrderUpdate(order_id, labelQuantity);     
        }  
    });  
});

function viewPackagesForm(url){
    url.searchParams.set('view', 'packages');
    window.history.replaceState(null, null, url);
    $( "div#order-items-container" ).hide( "fast" );
    $( "div#quantity-inputs-container" ).show( "fast" );
    $("#orderActionBtn").text('Naar pakbon');

}

function viewPackingSlip(url){
    url.searchParams.delete('view');
    window.history.replaceState(null, null, url);
    $( "div#order-items-container" ).show( "fast" );
    $( "div#quantity-inputs-container" ).hide( "fast" );
    $("#orderActionBtn").text('Naar samenstellen');
}

function getOrderNotes(order_id, ul=null){
    $.ajax({
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.getJSON('wp_CustomAuth').token);
        },
        url: 'https://'+self.location.host+'/get/order_notes/'+order_id,
        data: {},
        dataType: 'json',
        success: function(res) {
            if(res.hasOwnProperty('code')){
                if(res.code == 403){
                    flushSession(true);
                }
            }else{
                if(ul){
                    $("ul#order_notes_ul").replaceWith(ul.clone());
                }
                if(!res.length){
                    $("span#notes_status_message").text('Er zijn geen ordernotities.');
                    $("div#notes_status_spinner").removeClass('spinner-grow text-primary');
                    $("span#notes_status_message").removeClass('visually-hidden');
                }else{
                    $("li#notes_loading").addClass('d-none').removeClass('d-flex');
                    $(res).each(function(i, e) {
                        var customer_note_pill = '';
                        if(res[i]['customer_note']){
                            customer_note_pill = '<div class="position-absolute top-0 end-0 m-2"><div class="d-flex align-items-end flex-column">\
                            <span class="badge rounded-pill border border-secondary text-secondary mb-1">Klantnotitie</span></div></div>';
                        }
                        $("ul#order_notes_ul").append(
                        '<li class="d-flex justify-content-between mb-4"><div class="card flex-fill p-0"><div class="card-body">'+ customer_note_pill +'<p class="mb-0">'+ res[i]['note'] +'</p></div><div class="card-footer d-flex justify-content-between p-2"><p class="fw-bold mb-0">'+ res[i]['author'] +'</p>\
                            <p class="text-muted small mb-0">'+ res[i]['date_created'] +'</p></div></div></li>');
                    })
                    
                    $("span#order_notes_badge").text(res.length);
                    $("span#order_notes_badge").show('slow');
                }
            }
        }         
    });
}

function packingSlipData(res){
    if(res.hasOwnProperty('code')){
        if(res.code == 403){
            flushSession(true);
        }
    }else{
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
}

// function renderNotes(res){
//     if(!res.length){
//         $("span#notes_status_message").text('Er zijn geen ordernotities.');
//         $("div#notes_status_spinner").removeClass('spinner-grow text-primary');
//         $("span#notes_status_message").removeClass('visually-hidden');
//     }else{
//         $("li#notes_loading").hide();
//         $(res).each(function(i, e) {
//             $("ul#order_notes_ul").append(
//             '<li class="d-flex justify-content-between mb-4"><div class="card flex-fill p-0"><div class="card-body"><p class="mb-0">'+ res[i]['note'] +'</p></div><div class="card-footer d-flex justify-content-between p-2"><p class="fw-bold mb-0">'+ res[i]['author'] +'</p>\
//                 <p class="text-muted small mb-0">'+ res[i]['date_created'] +'</p></div></div></li>')
//         })
//     }
// }

function postOrderNote(order_id, ul){
    $('div#postOrderAlert').hide();
    var note = $("#noteTextArea").val();
    if(!note.length){
        $('div#postOrderAlert').html('Tekstinvoer is leeg!');
        $('div#postOrderAlert').show();
        return;
    }

    $("div#notes_status_spinner").addClass('spinner-grow text-primary');
    $("span#notes_status_message").addClass('visually-hidden');
    $("li#notes_loading").removeClass('d-none').addClass('d-flex');

    var customer_note = $("input[type='checkbox']#customerNoteSwitch").prop('checked');
    var label_note =  $("input[type='checkbox']#labelNoteSwitch").prop('checked');

    if(label_note){
        note = '<p id="wcgd_label_note">'+note+'</p>';
    }
    
    $.ajax({
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.getJSON('wp_CustomAuth').token);
        },
        url: 'https://'+self.location.host+'/post/order_note/'+order_id,
        data: {
            note: note,
            customer_note: customer_note
        },
        dataType: 'json',
        success: function(data) {
            console.log(data);
            if(data.hasOwnProperty('code')){
                $("li#notes_loading").addClass('d-none').removeClass('d-flex');
                $('div#postOrderAlert').html('<b>Foutcode '+data.code+'</b>: '+data.message);
                $('div#postOrderAlert').show();
            }else{
                $("#noteTextArea").val('');
                getOrderNotes(order_id, ul);
            }
        }         
    });



}

function orderData(res){

    $('p#stop-number-label').text('Stopnummer');
    $('p#stop-number').text(res.deliveryInformation.tripNumber);
    
    if ( res.deliveryInformation.tripNumber == '' ){
        $('p#stop-number').text('Op label schrijven!');
    }

    if ( res.deliveryInformation.delivery == 'Afhaalorder' ){
        $('p#stop-number-label').text('');
        $('p#stop-number').text('');
    }

    $('#dry_quantity_input').prop("value", res.deliveryInformation.dryAmount);
    $('#box_quantity_input').prop("value", res.deliveryInformation.boxAmount);
}

function prepareOrderUpdate(order_id, labelQuantity){
    const storedOrder = localStorage.getItem(order_id);
        let orderObj = JSON.parse(storedOrder);
        var dry = $('#dry_quantity_input').val();
        var box = $('#box_quantity_input').val();
        var packedBy = Cookies.getJSON('wp_CustomAuth').user_firstname;
        orderObj.labelQuantity = labelQuantity;
        orderObj.deliveryInformation.boxAmount = box;
        orderObj.deliveryInformation.dryAmount = dry;
        orderObj.deliveryInformation.pickedBy = packedBy;
        const updatedOrder = JSON.stringify(orderObj);
        localStorage.setItem(order_id, updatedOrder);
        const update_data = {id:order_id, dryAmount:dry, boxAmount:box, packedBy:packedBy};
        console.log(update_data);
        updateOrder(update_data);
}

function updateOrder(order_data){
    console.log('updateOrderCalled');
    console.log(order_data);
    Swal.fire({
        title: 'WooCommerce order meta bijwerken...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
            $.ajax({
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.getJSON('wp_CustomAuth').token);
                },
                url: 'https://'+self.location.host+'/update/order',
                data: {
                    id: order_data.id,
                    boxAmount: order_data.boxAmount,
                    dryAmount: order_data.dryAmount,
                    packedBy: order_data.packedBy
                },
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    if(data.hasOwnProperty('code')){
                        Swal.fire({
                            title: data.code,
                            html: data.message,
                            showDenyButton: true,
                            showCancelButton: true,
                            cancelButtonText: 'Annuleren',
                            confirmButtonText: 'Probeer opnieuw',
                            denyButtonText: 'Doorgaan zonder WooCommerce bijwerken',
                            allowEscapeKey: false,
                            allowOutsideClick: false
                          }).then((result) => {
                            console.log(result);
                            if (result.isConfirmed) {
                                updateOrder(order_data);
                            } else if (result.isDenied) {
                                printOrderLabel(order_data.id);
                            } else if (result.isDismissed) {
                                window.location.href=getReturnUrl();
                            }
                          })
                    }else{
                        printOrderLabel(order_data.id);
                    }
                }         
            });
        }
    })
}

function printOrderLabel(order_id){
    const orderStr = localStorage.getItem(order_id);
    let order = JSON.parse(orderStr);

    let print_data = {
        boxAmount: order.deliveryInformation.boxAmount,
        dryAmount: order.deliveryInformation.dryAmount,
        pickedBy: order.deliveryInformation.pickedBy,
        orderId: order.id,
        qrId: order.id,
        deliveryDate: order.deliveryInformation.deliveryDate,
        name: order.contactInformation.name,
        mobilePhone: order.contactInformation.mobilePhone,
        labelAmount: order.labelQuantity
    };

    if ('Afhaalorder' !== order.deliveryInformation.delivery){
        print_data = {
            ...print_data,
            tripNumber: order.deliveryInformation.tripNumber,
            leaveParcel: order.deliveryInformation.leaveParcel,
            deliveryComments: order.deliveryInformation.deliveryComments,
            address: order.addressInformation.address,
            postcode: order.addressInformation.postcode,
            cityName: order.addressInformation.cityName,    
        };
    }

    Swal.fire({
        title: 'Printopdracht verzenden naar server...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
            $.ajax({
                type: "POST",
                url: 'https://'+self.location.host+'/label/print',
                data: print_data,
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    if(data.hasOwnProperty('error')){  
      
                        var error_obj = JSON.stringify(data.error, null, '<br />');
                        error_obj = error_obj.replace(/{|}/g, '');             
                    
                        Swal.fire({
                            title: 'Print fout '+data.error.errno,
                            html: error_obj,
                            showDenyButton: false,
                            showCancelButton: true,
                            cancelButtonText: 'Annuleren',
                            confirmButtonText: 'Probeer opnieuw',
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                          }).then((result) => {
                            console.log(result);
                            if (result.isConfirmed) {
                                printOrderLabel(order_id);
                            } else if (result.isDismissed) {
                                window.location.href=getReturnUrl();
                            }
                          })
                    }else{
                        let timerInterval;
                        Swal.fire({
                            icon: "success",
                            title: "Printopdracht verzonden!",
                            timer: 2500,
                            timerProgressBar: true,
                            showConfirmButton: false,
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            willClose: () => {
                                clearInterval(timerInterval);
                            }
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.timer) {
                                // localStorage.clear();
                                window.location.href = getReturnUrl();
                            }
                        });
                    }
                }         
            });
        }
    })
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