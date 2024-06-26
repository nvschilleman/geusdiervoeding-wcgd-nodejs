function userAuth(input_username, input_password){
    $.ajax({
        type: "POST",
        url: 'https://'+self.location.host+'/user/auth',
        data: {
            username : input_username,
            password: input_password
        },
        success: userAuth_result,
        dataType: 'json'
    });
}

function userAuth_result(res){
    if(res.hasOwnProperty('code')){
        // console.log(res);
        Swal.fire({
            title: res.code,
            html: res.message,
            icon: 'error'
          });
    }
    else{
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Succesvol ingelogd!"
          }).then(function() {
            Cookies.set('wp_CustomAuth', res, { expires: 90 });
            window.location.href="/";
            });;     
    }
}

$(function() {

    // Notification alerts on signin page
    if(location.search.match('s=1')){
        $('.alert-info').css('visibility','visible').html(
            '<i class="fa fa-key" style="padding-right:3px" aria-hidden="true"></i>' +
            '<strong>Je bent uitgelogd</strong> vanwege veiligheidsredenen. Log opnieuw in alsjeblieft.'
        );
    }

    // Check if user already signed-in and display message
    if(Cookies.getJSON('wp_CustomAuth')){
        $('#user_display_name').text(Cookies.getJSON('wp_CustomAuth').user_nicename);
        $('.login-title').css('visibility','visible');
        $('.account-wall').css('visibility','hidden');
    }

    $('#signout').click(function(e){
        e.preventDefault();
        Cookies.remove('wp_CustomAuth');
        window.location.href = "/";
    });

    // Setup event click listener for the 'Sign in' button
    $(".form-signin").submit(function(event) {
        event.preventDefault();
        var input_username = $("input:first").val(),
            input_password = $("input:password").val();
        userAuth(input_username, input_password);
    });
});