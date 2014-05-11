
function buyApp(btnDOM, db_appname, dummy){
  console.log(btnDOM.value);
  if(dummy !=  true){
    document.getElementById("loadingGif").hidden = false;   console.log(btnDOM.parentElement.parentElement.getElementsByClassName("itemName")[0].innerText);
  }
  $.post("http://docm.parseapp.com/uploadRunningApp",
    {"username":"hc","password":"hc","name":db_appname},
    function(data){
      var waitTime = 1000;
      if(dummy==true){
        waitTime=0;
      }
      window.setTimeout(function(){
        document.getElementById("loadingGif").hidden = true;
        if(dummy != true && data.success==true){
          btnDOM.parentElement.getElementsByClassName("buyAppBtn")[0].style.display= "none";
          btnDOM.parentElement.getElementsByClassName("addToWishListBtn")[0].style.display= "none";
          btnDOM.parentElement.getElementsByClassName("goToAppBtn")[0].style.display= "";
        }
        if(data.success!=true){
          alert("Could not connect to server. Check your Internet connection.");
        }
      },waitTime);
      // btnDOM.parentElement.getElementsByClassName("addToWishList")[0].hidden = true; //does not work for input
  });
}












