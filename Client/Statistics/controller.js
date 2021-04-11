window.onload = async function setTopPlayers()
{ 
    var name;

    await fetch('/getUsername',
    {
        mode:'cors'
    })
        .then(response => response.text())
        .then(data => {
            name = data;
    });

    fetch('/getTopPlayers', {
        method: 'GET',
        mode: 'cors',
        headers: {
        'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {        
        
        data.map((row, index) => {

            console.log("data[i].username: " + row.username);
            console.log("name: " + name);

            if(row.username == name){
                console.log("match");
                field = document.getElementById("platzierung");
                field.innerHTML = index + 1 +".";
                field = document.getElementById("name4");
                field.innerHTML = row.username;
                field = document.getElementById("amount4");
                field.innerHTML = row.coins;
            }
        })

        var field = document.getElementById("name1");
        field.innerHTML = data[0].username;
        field = document.getElementById("amount1");
        field.innerHTML = data[0].coins;

        if(data[1] != null){
            field = document.getElementById("name2");
            field.innerHTML = data[1].username;
            field = document.getElementById("amount2");
            field.innerHTML = data[1].coins;
        }

        if(data[2] != null){
            field = document.getElementById("name3");
            field.innerHTML = data[2].username;
            field = document.getElementById("amount3");
            field.innerHTML = data[2].coins;
        }           
        
    })    
}