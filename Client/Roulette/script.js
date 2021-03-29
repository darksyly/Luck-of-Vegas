;(function(loader) {
  document.addEventListener("DOMContentLoaded", loader[0], false);
})([function (eventLoadedPage) {
  "use strict";


  function rand (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
  }

  
/* var wrap, colors;
  var pallete = [
    "g0", "b11", "r5", "b10", "r6", "b9",
    "r7", "b8", "r1", "b14", "r2", "b13",
    "r3", "b12", "r4"
];


  var bets = {
    "green": [0],
    "red": [5, 6, 7, 1, 2, 3, 4],
    "black": [11, 10, 9, 8, 14, 13, 12]
}

  var width = 64;
var pos = 7;
  wrap = document.querySelector('.roulette-container .wrap');

  function spin_promise (number) {
    return new Promise((resolve, reject) => {
        color = '0';
        if(number == 0)
        {
            color = 'g'
        }
        else if(number > 7 && number < 15)
        {
            color = 'b'
        }
        else if(number > 0 && number < 8)
        {
            color = 'r';
        }

        if (color != '0') 
        {
            console.log("color: " + color);
            console.log("number: " + number);
            var fieldSize = 64 * (4/3);

            var index = pallete.indexOf(color[0] + "" + number);
            var pixels = 1280 * 15; //15rolls
            wrap.offsetWidth;
            pixels += (pallete.length - pos) * fieldSize;
            pos = 0;
            pixels += index * fieldSize;
            pos = index;
            wrap.style.backgroundPosition = -pixels + "px";

        }
        else{
            console.log("error!!!");
        }
    });
  }*/
  var i = 0;
}]);


let wrap, colors;

  let pallete = [
    "g0", "b11", "r5", "b10", "r6", "b9",
    "r7", "b8", "r1", "b14", "r2", "b13",
    "r3", "b12", "r4"
];


  let bets = {
    "green": [0],
    "red": [5, 6, 7, 1, 2, 3, 4],
    "black": [11, 10, 9, 8, 14, 13, 12]
}

let width = 64;
let pos = 7;
 

  function spin_promise (number) {

        color = '0';
        if(number == 0)
        {
            color = 'g'
        }
        else if(number > 7 && number < 15)
        {
            color = 'b'
        }
        else if(number > 0 && number < 8)
        {
            color = 'r';
        }

        if (color != '0') 
        {
            wrap.style.backgroundPosition = (16*1280) + "px";
            console.log("color: " + color);
            console.log("number: " + number);
            var fieldSize = 64 * (4/3);
            var index = pallete.indexOf(color[0] + "" + number);
            var pixels = 1280 * 15; //15rolls
            wrap.offsetWidth;
            pixels += (pallete.length - pos) * fieldSize;
            pos = 0;
            pixels += index * fieldSize;
            pos = index;
            wrap.style.backgroundPosition = (-pixels) + "px";
        }
        else{
            console.log("error!!!");
        }
  }



function rouletteBet (colorButton) {
    
    var e = document.getElementById("rInput");
    var amount = e.value;
    var color = colorButton.value;
    var data = {
        "bet": {
            "money" : amount,
            "color" : color
        }
    }
    if(amount<10)
    {
        console.log("error!!!! rouletteBet");
        return;
    }
    console.log("hello");

    var response = fetch('http://192.168.43.109:8081/RouletteBet', {
    method: 'POST', // or 'PUT'
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    spin_promise(data.erg.rouletteResult);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  }

window.onload = function() {
    wrap = document.querySelector('.roulette-container .wrap');
}