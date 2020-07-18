console.log("here");
var validateEmail;
var email;
var pass;
function getemail(val)
{
    email=val;
    let pattern =/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{3}$/; 

    if(email.match(pattern))
    validateEmail=true;   
myemail();
}
function myemail()
{
    if(!validateEmail)
    document.getElementById("eValid").innerHTML="Email should be of type example@example.com";
    else
     document.getElementById("eValid").innerHTML="";
}
function getPass(val)
{
    pass=val;
    if(pass.length>=8)
    {
         document.getElementById("ePass").innerHTML="";
    }
    else
     document.getElementById("ePass").innerHTML="Password should be of minimum 8 characters";
}
function getCPass(val)
{
    if(val==pass)
         document.getElementById("cPass").innerHTML="";
    
    else
     document.getElementById("cPass").innerHTML="Passwords do not match";
}
function login(){
     console.log("hello");
     $.ajax({
         url: '/login',
         success: function(data){
            window.location = "http://localhost:8000/login";
         }
       });
   }