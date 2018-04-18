$(document).ready(function(){
    // alert("hi");
    $(".message").fadeIn();
    setTimeout(function(){
        $(".message").fadeOut();
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