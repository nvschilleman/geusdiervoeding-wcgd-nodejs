$(function() {
    const order_id = getUrlParameter('id');
    const orderStr = localStorage.getItem(order_id);
    let order = JSON.parse(orderStr);

    if(order === null){
        console.log('getOrderCalled');
        order = getOrder(order_id);
    }else{
        orderData(order);
    }
    
    // orderData(order);

    $('#dry_quantity_input').niceNumber({autoSize:false});
    $('#box_quantity_input').niceNumber({autoSize:false});

    $("#customerInfoContainer").on("show.bs.collapse", () => {
        $('#customerInfoCollapseCaption').html('Klantdetails verbergen');
    });

    $("#customerInfoContainer").on("hide.bs.collapse", () => {
        $('#customerInfoCollapseCaption').html('Klantdetails weergeven');
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
                                window.location.href="/scan/order";
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
                                window.location.href="/scan/order";
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
                                window.location.href = '/scan/order';
                            }
                        });
                    }
                }         
            });
        }
    })
}

function orderData(res){

        $('#delivery_method_prefix').text('Route ');
        $('#delivery_date_title').text('Bezorgdatum ');
        $('#trip_number').text(res.deliveryInformation.tripNumber);

        if ( res.deliveryInformation.tripNumber == '' ){
            $('#tripnumber').text('Stopnummer handmatig op label schrijven');
        }

        if ( res.deliveryInformation.delivery == 'Afhaalorder' ){
            $('#delivery_method_prefix').text('');
            $('#delivery_date_title').text('Afhaaldatum ');
            $('#tripnumber').text('');
            $('#trip_number').text('');
        }

        $('#delivery_method').text(res.deliveryInformation.delivery);
        $('#order_id').text(res.id);
        $('#delivery_date').text(res.deliveryInformation.deliveryDate);
        $('#customerName').text(res.contactInformation.name);
        $('#customerAddress').text(res.addressInformation.address);
        $('#postcode').text(res.addressInformation.postcode);
        $('#cityName').text(res.addressInformation.cityName);
        $('#emailAddress').text(res.contactInformation.email);
        $('#mobilePhone').text(res.contactInformation.mobilePhone);
        $('#dry_quantity_input').prop("value", res.deliveryInformation.dryAmount);
        $('#box_quantity_input').prop("value", res.deliveryInformation.boxAmount);
    }