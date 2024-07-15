var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

const showLoading = function() {
    Swal.fire({
        title: 'Aan het laden...',
        showConfirmButton:false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        //timer: 4500,
        didOpen: () => {
            Swal.showLoading();
        }
    })
};

function toastNotification(msg){
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: msg.timer,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: msg.icon,
        title: msg.title
      });     
}


function getOrder(order_id){

    const localStorage_order = localStorage.getItem(order_id);
    let order = JSON.parse(localStorage_order);

    if(order === null){
        console.log('orderNull');
        showLoading();
        $.ajax({
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.getJSON('wp_CustomAuth').token);
            },
            url: 'https://'+self.location.host+'/get/order',
            data: {
                id: order_id 
            },
            success: getOrderResult,
            dataType: 'json'
        });
    }else{
        console.log('orderCached');
        console.log(order);
        getOrderResult(order);
    }
    

}

$(function() {

    console.log(getReturnUrl());

    $('li.active').removeClass('active').removeAttr('aria-current');
    $('a[href="' + location.pathname + location.search +'"]').closest('li').addClass('active').attr('aria-current', 'page'); 
      

    $('#user_display_name').text(Cookies.getJSON('wp_CustomAuth').user_display_name);
    $('button#signout_button').click(function(e) {
        e.preventDefault();
        flushSession();
    });
});

function redirect(res){
    console.log('Pathname '+window.location.pathname);
    if (window.location.pathname == '/scan/order' || window.location.pathname == '/list/orders' || window.location.pathname.startsWith('/view/order') ){
        window.location.href = "/order?id="+res.id;
    }else{
        orderData(res);
    }   
}

async function getOrderResult(res){
    console.log('getOrderAsync');
    console.log(res);
    let icon = 'error';
    if(res.hasOwnProperty('code')){
        if (res.code == 'see_parent_order'){
            Swal.fire({
                title: 'Zie hoofdorder!',
                html: res.message,
                showDenyButton: false,
                showCancelButton: true,
                cancelButtonText: 'Annuleren',
                confirmButtonText: 'Hoofdorder openen',
                allowEscapeKey: false,
                allowOutsideClick: false
              }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href='/order?id='+res.data.parent_id+'&swr=1'
                } else if (result.isDismissed) {
                    if (window.location.pathname == '/scan/order'){
                        window.location.href = '/scan/order';
                    }
                }
              })
        }else{
            Swal.fire({
                title: res.code,
                html: res.message,
                icon: 'error'
            });
        }
    return;
    }

    if(res.combineOrderChild !== null && res.combineOrderChild !== undefined && res.combineOrderChild !== ''){
        if(!location.search.match('swr=1')){
            let result = await Swal.fire({
                title: 'Dit is een combi order!',
                text: 'Vergeet de artikelen van order #'+res.combineOrderChild+' niet bij deze order te voegen!',
                showDenyButton: false,
                showCancelButton: false,
                confirmButtonText: 'Ok',
                allowEscapeKey: false,
                allowOutsideClick: false
            })
        } 
    }  

    if(res.deliveryInformation.pickedBy !== ''){
        let orderAlreadyPackedNotify = await Swal.fire({
            title: 'Deze order is al ingepakt!',
            text: res.deliveryInformation.pickedBy+' heeft deze order al ingepakt, wil je de samenstelling wijzigen?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ja',
            denyButtonText: 'Nee',
            allowEscapeKey: false,
            allowOutsideClick: false
        })

        if (false === orderAlreadyPackedNotify.value){   
            if (window.location.pathname == '/scan/order'){
                window.location.href = '/scan/order';
            }
            console.log('alreadyPackedNotify dismissed');
            return false;
        }
    }

    if(res.deliveryInformation.delivery == 'Afhaalorder'){
        let collectOrderNotify = await Swal.fire({
            title: 'Dit is een afhaalorder',
            text: 'Wil je afhaallabels printen of deze order als afgehaald melden?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Afhaallabels printen',
            denyButtonText: 'Order gereedmelden',
            allowEscapeKey: false,
            allowOutsideClick: true
        })

        if(typeof collectOrderNotify.value === 'undefined') {
            if (window.location.pathname == '/scan/order'){
                window.location.href = '/scan/order';
            }
            console.log('collectOrderNotify dismissed');
            return false;
        }
        
        if(typeof collectOrderNotify.value === 'boolean' && collectOrderNotify.value === false) {
            
            var markedBy = Cookies.getJSON('wp_CustomAuth').user_firstname;
            collectedOrder({id:res.id, user:markedBy});
            // if (window.location.pathname == '/scan/order'){
            //     $("#input_orderid").val('');
            // }else{
            //     window.location.href = '/scan/order'
            // }  
            
            return false;
        }
    }  

    const order = JSON.stringify(res);
    localStorage.setItem(res.id, order);
    redirect(res);
}

function getReturnUrl(){
    return_url = sessionStorage.getItem('returnUrl');
    if(!return_url){
        return_url = '/list/orders';
    }
    return return_url;
}

function collectedOrder(order_data){

    console.log('collectedOrderCalled');
    console.log(order_data);
    Swal.fire({
        title: 'Order gereedmelden...',
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
                url: 'https://'+self.location.host+'/mark_collected/order',
                data: {
                    id: order_data.id,
                    user: order_data.user
                },
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    if(data.hasOwnProperty('code')){
                        Swal.fire({
                            title: data.code,
                            html: data.message,
                            showDenyButton: true,
                            showCancelButton: false,
                            confirmButtonText: 'Probeer opnieuw',
                            denyButtonText: 'Annuleren',
                            allowEscapeKey: false,
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                collectedOrder(order_data);
                            }else if(result.isDenied) {
                                window.location.href = getReturnUrl();
                            }
                        });
                    }else{
                        let timerInterval;
                        Swal.fire({
                            icon: "success",
                            title: "Order afgerond!",
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
                                window.location.href = getReturnUrl();
                            }
                        });
                    }
                }         
            });
        }
    })
}

function flushSession(isTokenError) {
    Cookies.remove('wp_CustomAuth');
    if(isTokenError) { window.location.href="/signin?s=1"; } // s=1 token failure (alert signin header notification)
    else{ window.location.href = "/signin"; }
}

  