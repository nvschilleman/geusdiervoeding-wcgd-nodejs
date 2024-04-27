$(document).ready(function(){

    var lastResult = null, countResults = 0;

    $.ajax({
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + Cookies.getJSON('wp_CustomAuth').token);
        },
        url: 'https://'+self.location.host+'/user/home',
        data: {},
        success: userData,
        dataType: 'json'
    });
    




    var html5QrcodeScanner = new Html5QrcodeScanner(
        "barcodeScanner", { fps: 10, qrbox: {width: 300, height: 150} });

    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            console.log(decodedText+' IS NOT '+lastResult);
            ++countResults;
            lastResult = decodedText;
            console.log(`Scan result ${decodedText}`, decodedResult);
            html5QrcodeScanner.clear();
            requestProduct(decodedText);
           
        }
    }

    html5QrcodeScanner.render(onScanSuccess);

    $('#input_productsku').keyup(function () {
        this.value = this.value.replace(/[^0-9\.]/g,'');
     });

    $(".form-getproduct").submit(function(event) {
        event.preventDefault();

        var input_productsku = $("#input_productsku").val();
        

        if (!isNumeric(input_productsku)){
            Swal.fire({
                title: 'Invoer niet numeriek!',
                html: 'Alleen numerieke invoer is toegestaan.',
                icon: 'error'
            }).then(function() {
                $("#input_productsku").val('');
        });;
        }else{
          
            requestProduct(input_productsku);
        }
    });

    $('span#html5-qrcode-anchor-scan-type-change').removeClass('btn btn-lg btn-primary');

});

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

function userData(res){
    if(res.success) {
        console.log('UserData');
        // console.log(Cookies.getJSON('wp_CustomAuth'));
        // if(Cookies.getJSON('wp_CustomAuth').user_role !== 'administrator'){
        //     flushSession(true);
        // }
    }
    else {
        flushSession(true);
    }
}

function flushSession(isTokenError) {
    Cookies.remove('wp_CustomAuth');
    if(isTokenError) { window.location.href="/signin?s=1"; } // s=1 token failure (alert signin header notification)
    else{ window.location.href = "/signin"; }
}



function requestProduct(sku){
    Swal.fire({
        title: 'Product zoeken...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
            $.ajax({
                type: "GET",
                url: 'https://geusdiervoeding.nl/api/json.php?sku='+sku,
                dataType: 'json',
                success: function(data) {
                    window.location.href = '/view/product/'+sku;  
                },   
                error:function (xhr, ajaxOptions, thrownError){
                        Swal.fire({
                            title: 'HTTP Error '+xhr.status,
                            html: 'Geen product gevonden met opgegeven SKU!',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: 'Ok',
                            allowEscapeKey: false,
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $("#input_productsku").val('');
                            }
                        });
                }      
            });
        }
    })
}
