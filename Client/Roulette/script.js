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
let bet = [];

window.onload = function() {
    wrap = document.querySelector('.roulette-container .wrap');

    fetch('http://localhost:34567/getCoins',
        {
            mode:'cors'
        })
        .then(response => response.text())
        .then(data => {
        var field = document.getElementById("anzCoins");
        field.innerHTML = data;});

        fetch('http://localhost:34567/getUsername',
    {
        mode:'cors'
    })
    .then(response => response.text())
    .then(data => {
    var field = document.getElementById("name");
    field.innerHTML = data;});
}

function addBet(button, amount)
{
    //if(bet.length > 4) //maximum 4 bets
    var elem = null;
    for(var i=0; i<bet.length; i++)
    {
        if(bet[i].color == button.value)
        {
            elem = bet[i];
            break;
        }
    }
    if(elem != null){
        elem.amount += parseInt(amount.value);
        document.getElementById(button.value + "Buttonlable").innerHTML = elem.amount;
    }
    else{
        if(amount.value < 10)
        {
            createMessage("minimum value is 10");
            return;
        }
        bet.push({
            "color": button.value,
            "amount": parseInt(amount.value)
        });

        document.getElementById(button.value + "Buttonlable").innerHTML = amount.value;

    }
    console.log(bet)
}

function clearBet()
{
    for(var i=0; i<bet.length; i++)
    {
        document.getElementById(bet[i].color + "Buttonlable").innerHTML = "";
    }
    bet = [];
    
}

async function rouletteBet()
{
    var money;
    disableButtons();
    await fetch('http://localhost:34567/RouletteBet', {
        method: 'POST',
        mode: 'cors',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(bet)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if(data.error != undefined)
        {
            createMessage(data.error);
            return;
        }
        spin(data.result);
        /*setTimeout(function () {
            document.getElementById("anzCoins").innerHTML = data.money;
            clearBet();
          }, 5000);*/
        money = data.money;
    })
    await updateCoins(money);
    enableButtons();
}

function spin(number)
{
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
    if(color != '0')
    {
        console.log("color: " + color);
        console.log("number: " + number);
        var fieldSize = 64 * (1280/960);
        var index = pallete.indexOf(color[0] + "" + number);
        var pixels = 1280 * 15; //15rolls

        if(wrap.style.backgroundPosition.length != 0)
        {
          var str = wrap.style.backgroundPosition.split(" ");
          pixels += parseInt(str[0]) * -1;
        }     
        pixels += (pallete.length - pos) * fieldSize;
        pos = 0;
        pixels += index * fieldSize;
        pos = index;
        wrap.style.backgroundPosition = (-pixels) + "px";
        //wrap.offsetWidth;
    }
    else{
        createMessage("error!!!");
    }
}

function removeMessage(elem)
{
    //document.getElementById("alertID").innerHTML = ""
    elem.remove();
}

function createMessage(messageText)
{
    console.log(messageText);
    var elem = document.createElement("div");
    elem.innerHTML = messageText;
    elem.className = "message";
    elem.onclick = "removeMessage(this)";
    document.getElementById("alertID").appendChild(elem);
    setTimeout(function () {
        removeMessage(elem);
    }, 5000);
}

function logout() {
    
    fetch('http://localhost:34567/logout')
    .then(response => {if(response.redirected){return response.url}})
    .then(data => {window.location.replace(data)})
    .catch(data => {console.err(data)})
}

function disableButtons()
{
    document.getElementById("redButton").disabled = true;
    document.getElementById("greenButton").disabled = true;
    document.getElementById("blackButton").disabled = true;
    document.getElementById("1Button").disabled = true;
    document.getElementById("2Button").disabled = true;
    document.getElementById("3Button").disabled = true;
    document.getElementById("4Button").disabled = true;
    document.getElementById("5Button").disabled = true;
    document.getElementById("6Button").disabled = true;
    document.getElementById("7Button").disabled = true;
    document.getElementById("8Button").disabled = true;
    document.getElementById("9Button").disabled = true;
    document.getElementById("10Button").disabled = true;
    document.getElementById("11Button").disabled = true;
    document.getElementById("12Button").disabled = true;
    document.getElementById("13Button").disabled = true;
    document.getElementById("14Button").disabled = true;
}

function enableButtons()
{
    document.getElementById("redButton").disabled = false;
    document.getElementById("greenButton").disabled = false;
    document.getElementById("blackButton").disabled = false;
    document.getElementById("1Button").disabled = false;
    document.getElementById("2Button").disabled = false;
    document.getElementById("3Button").disabled = false;
    document.getElementById("4Button").disabled = false;
    document.getElementById("5Button").disabled = false;
    document.getElementById("6Button").disabled = false;
    document.getElementById("7Button").disabled = false;
    document.getElementById("8Button").disabled = false;
    document.getElementById("9Button").disabled = false;
    document.getElementById("10Button").disabled = false;
    document.getElementById("11Button").disabled = false;
    document.getElementById("12Button").disabled = false;
    document.getElementById("13Button").disabled = false;
    document.getElementById("14Button").disabled = false;
}

async function updateCoins(money)
{
  return new Promise(resolve => {
    setTimeout(function () {
        document.getElementById("anzCoins").innerHTML = money;
        clearBet();
        resolve();
      }, 5000);
  });
}
