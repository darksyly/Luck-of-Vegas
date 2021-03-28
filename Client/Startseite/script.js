var slideIndex = 1;
var x = document.getElementsByClassName("bilder");
showDivs(slideIndex);

function myFunction() {
    x[0].style.display="block";
    x[1].style.display = "block";
    
}

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length-1}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";
  x[slideIndex].style.display = "block";
  //alert(slideIndex-1);
  
}