$(function() {
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

    $('#user_firstname').text(Cookies.getJSON('wp_CustomAuth').user_display_name);
    
});

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


