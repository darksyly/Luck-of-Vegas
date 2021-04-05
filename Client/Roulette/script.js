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
 

function spin_promise (number, amount, userColor) {
        color = '0';
        var elem;

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

          if(userColor == 'Red')
          {
            elem = "bet-redButtonlable"
          }
          else if(userColor == 'Green')
          {
            elem = "bet-greenButtonlable";
          }
          else if(userColor == 'Black')
          {
            elem = "bet-blackButtonlable"
          }



            document.getElementById(elem).innerHTML = amount;
            console.log("color: " + color);
            console.log("number: " + number);
            var fieldSize = 64 * (1280/960);
            var index = pallete.indexOf(color[0] + "" + number);
            var pixels = 1280 * 15; //15rolls

            if(wrap.style.backgroundPosition.length != 0)
            {
              console.log("Hello");
              var str = wrap.style.backgroundPosition.split(" ");
              pixels += parseInt(str[0]) * -1;
            }
            
            pixels += (pallete.length - pos) * fieldSize;
            pos = 0;
            pixels += index * fieldSize;
            pos = index;
            wrap.style.backgroundPosition = (-pixels) + "px";
            wrap.offsetWidth;

            setTimeout(function () {
              document.getElementById(elem).innerHTML = "";
            }, 5000);
            console.log("finished");
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

    var response = fetch('http://localhost:34567/RouletteBet', {
    method: 'POST', // or 'PUT'
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if(data.erg.rouletteResult)


    console.log('Success:', data);
    spin_promise(data.erg.rouletteResult, amount, color);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  }

window.onload = function() {
    wrap = document.querySelector('.roulette-container .wrap');
}
