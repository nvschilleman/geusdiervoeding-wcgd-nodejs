$(function() {

    sessionStorage.setItem('returnUrl', '/scan/order');

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

    var html5QrcodeScanner = new Html5QrcodeScanner("qrScanner", {
        fps: 10,
        qrbox: 250,
        rememberLastUsedCamera: true
        });

    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            ++countResults;
            lastResult = decodedText;
            console.log(`Scan result ${decodedText}`, decodedResult);
            html5QrcodeScanner.clear();
            getOrder(decodedText);
           
        }
    }

    html5QrcodeScanner.render(onScanSuccess);

    $('#input_orderid').keyup(function () {
        this.value = this.value.replace(/[^0-9\.]/g,'');
     });

    $(".form-getorder").submit(function(event) {
        event.preventDefault();

        var input_orderid = $("#input_orderid").val();
        

        if (!isNumeric(input_orderid)){
            Swal.fire({
                title: 'Invoer niet numeriek!',
                html: 'Alleen numerieke invoer is toegestaan.',
                icon: 'error'
            }).then(function() {
                $("#input_orderid").val('');
        });;
        }else{
            getOrder(input_orderid);
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


