var bildR=document.getElementById("bildR");
var bildC=document.getElementById("bildC");

function check1() {
    if(document.getElementById("r1").checked == true){
        bildC.style.visibility="hidden";
        bildR.style.visibility="visible";
        console.log("sepp");
    }
}

function check2() {
    if(document.getElementById("r2").checked == true){
        bildR.style.visibility="hidden";
        bildC.style.visibility="visible";
        console.log("sepp2");
    }
}