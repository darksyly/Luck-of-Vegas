var bildR=document.getElementById("bildR");
var bildC=document.getElementById("bildC");
var current=0;
var maxCurrent=1;

function change() {
    if(current<maxCurrent){
        current=current+1;
        bildR.style.visibility="hidden";
        bildC.style.visibility="visible";
        console.log(current);
    }else{
        bildR.style.visibility="visible";
        bildC.style.visibility="hidden";
        current=0;
        console.log(current);
    }
    
    
}




function logout() {
    
    fetch('/logout')
    .then(response => {if(response.redirected){return response.url}})
    .then(data => {window.location.replace(data)})
    .catch(data => {console.err(data)})
}

window.onload = function updateCoins(){
        fetch('/getCoins',
        {
            mode:'cors'
        })
        .then(response => response.text())
        .then(data => {
        var field = document.getElementById("anzCoins");
        field.innerHTML = data;});

        fetch('/getUsername',
    {
        mode:'cors'
    })
    .then(response => response.text())
    .then(data => {
    var field = document.getElementById("name");
    field.innerHTML = data;});
}
   
