function login(e) {
    console.log('test')
    fetch('http://localhost:34567/loginVal', formData.get('benutzername'), formData.get('password') )
    .then(response => {if(response.redirected){return response.url}})
    .then(data => {if(data != undefined){window.location.replace(data)}})
    .catch(data => {console.err(data)})

    e.preventDefault();
    return false;
}

function register(e) {
    console.log("register");
    e.preventDefault();
    return false; 
}


window.onload = function removeMessage(elem)
{
    document.getElementById("alertID").innerHTML = ""
    elem.style.display = "none"
}

