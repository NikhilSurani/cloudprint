$(document).ready(function(){
    
    $(".message").show();
    setTimeout(function(){
        $(".message").hide();
      }, 4000);  

      $( "#search_txt" ).keyup(function() {          
          setTimeout( () => {
            let inputText = $(this).val();
            if(inputText){
                window.location.href = '/users?search='+ inputText;        
            }else {
                window.location.href = '/users';        
            }
          }, 1000);        
      });

      $(".search-btn").on("click", function (){
        $( "#search_txt" ).val("");
        window.location.href = '/users?searchremove=1';        
      });

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
