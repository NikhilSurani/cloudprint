$(document).ready(function(){
    
    $(".message").show();
    setTimeout(function(){
        $(".message").hide();
      }, 2000);  

});



function addUser(){
            
    window.location.href = '/users/add';
}
function cancelAdd(){
    
    window.location.href = '/users';
}

function signUp(){
    window.location.href = '/signup';

}

function loginPage(){
    window.location.href = '/';

}