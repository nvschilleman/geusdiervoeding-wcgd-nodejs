
$(document).ready(function(){
    
    $( "button#btn_backtoscan" ).on( "click", function() {
        window.location.href='/scan/product'
    } );
    // $.ajax({
    //     type: "GET",
    //     url: 'https://'+self.location.host+'/view/product?sku='+product_sku,
    //     beforeSend: function (xhr) {
    //         xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.getJSON('wp_CustomAuth').token);
    //     },
    //     dataType: 'json',
    //     success: function(data) {
    //         console.log(data);
    //         if(data.hasOwnProperty('error')){
    //             Swal.fire({
    //                 title: 'Foutmelding',
    //                 html: data.error,
    //                 showDenyButton: false,
    //                 showCancelButton: false,
    //                 confirmButtonText: 'Ok',
    //                 allowEscapeKey: false,
    //                 allowOutsideClick: false
    //             }).then((result) => {
    //                 if (result.isConfirmed) {
    //                     window.location.href = '/scan/product'
    //                 }
    //             });
    //         }else{
    //             console.log(data);
    //             showProductData(data);
    //         }
    //     }         
    // });
    
});   

function flushSession(isTokenError) {
    Cookies.remove('wp_CustomAuth');
    if(isTokenError) { window.location.href="/signin?s=1"; } // s=1 token failure (alert signin header notification)
    else{ window.location.href = "/signin"; }
}




