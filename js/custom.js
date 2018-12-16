$(document).ready(function() {


    $(document).on('click', '#btn-link-login', function () {
        window.location.replace('inner.html');
        return false;
    })

    $(document).on('click', '#home-link', function () {
        window.location.replace('inner.html');
        return false;
    })

    $(document).on('click', '.link-logout', function () {

        window.location.replace('login.html');
        return false;
    })

    $(document).on('click','#btn-slider-login',function (){
        window.location.replace('login.html');
        return false;
    });

})

