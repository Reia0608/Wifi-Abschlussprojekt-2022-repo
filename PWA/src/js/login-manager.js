const apiBaseUrl = 'http://localhost:59968/api/';

const inputUserName = document.getElementById('inputUserName');
const inputPassword = document.getElementById('inputPassword');
const passwordButton = document.getElementById('passwordButton');
const buttonRegister = document.querySelector('#buttonRegister'); 
const buttonLogin = document.getElementById('buttonLogin');

if(document.cookie) var benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];

//======================================================================
// events

// buttonRegister
buttonRegister.addEventListener('click', (e) => 
{
    window.open('http://localhost:5500/src/signup.html', '_self');
});

//======================================================================
// login

buttonLogin.addEventListener( 'click', () => 
{
    if (inputUserName.value && inputPassword.value) 
    {
        ApiBenutzerLogin((response) => 
        {
            if (response.success) 
            {
                ApiPageInit(() => 
                {
                    console.log('login fetch successful!');
                    console.log("angemeldet!");
                    window.open('http://localhost:5500/src/index.html', '_self');

                }, (ex) => 
                {
                    alert(ex);
                }, benutzerMerkmal);
            }
            else 
            {
                alert(response.message);
            }
        }, (ex) => 
        {
            alert(ex);
        }, 
        {
            benutzer: inputUserName.value,
            pwd: inputPassword.value
        });
    }
    else
    {
        alert('Benutzer/Passwort fehlt!!!');
    } 
})

//======================================================================
// eye-con

passwordButton.addEventListener('click', (e)=>
{
    if(passwordButton.dataset.view == 'off')
    {
        passwordButton.dataset.view = 'on';
        passwordButton.innerHTML = '<span class="iconify" data-icon="mdi-eye-outline"></span>';
        inputPassword.type = "text";
    }
    else
    {
        passwordButton.dataset.view = 'off';
        passwordButton.innerHTML = '<span class="iconify" data-icon="mdi-eye-off-outline"></span>';
        inputPassword.type = "password";
    }
});

//======================================================================
// API

function ApiBenutzerLogin(successCallback, errorCallback, args) 
{
    fetch(apiBaseUrl + 'benutzer/login', 
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'}, // 'Content-Type': 'application/x-www-form-urlencoded',
        body: JSON.stringify(args),
        cache: 'no-cache',
        credentials: 'include'
    })
    .then((response)=>
    {
        if (response.status == 200 || response.status == 401)
        {
            return response.json();
        } 
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    }).then(successCallback)
    .catch(errorCallback);
}

function ApiBenutzerLogoff(successCallback, errorCallback) 
{
    fetch(apiBaseUrl + 'benutzer/logoff', 
    {
        method: 'DELETE',
        cache: 'no-cache',
        credentials: 'include'
    })
    .then((response) => 
    {
        if (response.status == 200) 
        {
            return successCallback();
        }
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    })
    .catch(errorCallback);
}

function ApiPageInit(successCallback, errorCallback, benutzerMerkmal) 
{
    fetch(this.apiBaseUrl + 'page/init' + (benutzerMerkmal ? '?bm=' + benutzerMerkmal : '') , 
    {
        method: 'GET'
    })
    .then((response) => 
    {
        if (response.status == 200) 
        {
            return response.json();
        }
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    })
    .then(successCallback)
    .catch(errorCallback);
}