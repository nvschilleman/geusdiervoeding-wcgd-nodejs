$(function() {  
    $( "button#btn_backtoscan" ).on( "click", function() {
        window.location.href='/scan/product'
    } );  
});   

function flushSession(isTokenError) {
    Cookies.remove('wp_CustomAuth');
    if(isTokenError) { window.location.href="/signin?s=1"; } // s=1 token failure (alert signin header notification)
    else{ window.location.href = "/signin"; }
}




