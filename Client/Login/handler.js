function login(e) {

    console.log("Form Data Password" + document.getElementById("password").value)
    console.log("Form Data Username" + document.getElementById("username").value)

    var credentials ={
        "password": document.getElementById("password").value,
        "username": document.getElementById("username").value
    }

    fetch('/loginVal', {
        method: 'POST',
        mode: 'cors',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Client recieved from Server: " + data)
        if(data == "true"){
            window.location.replace('/home');
        }else{
            var el = document.getElementById("alertID")
            el.style.display = "block"
        }
    })
    .catch(data => {console.err(data)})

    e.preventDefault();
    return false;
}

function register(e) {
    console.log("register");
    e.preventDefault();
    return false; 
}

window.onload = function removeMessage()
{
    var el = document.getElementById("alertID")
    el.style.display = "none"
}

