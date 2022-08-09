const apiBaseUrl = 'http://localhost:59968/api/';

const inputVorname = document.querySelector('#inputVorname');
const inputNachname = document.querySelector('#inputNachname');
const inputBenutzer = document.querySelector('#inputBenutzer');
const inputPasswordFirst = document.querySelector('#inputPasswordFirst');
const inputPasswordSecond = document.querySelector('#inputPasswordSecond');

const buttonSave = document.querySelector('#buttonSave');

//======================================================================
// events

buttonSave.addEventListener( 'click', (e) => 
{

    if (inputPasswordFirst.value == inputPasswordSecond.value) 
    {
        let benutzer = 
        {
            vorname: inputVorname.value,
            nachname: inputNachname.value,
            username: inputBenutzer.value,
            passwort: inputPasswordFirst.value
        };

        ApiBenutzerSet(() => 
        {
            window.open('http://localhost:5500/src/login.html', '_self');
        }, (ex) => 
        {
            alert(ex);
        }, benutzer);

    }
    else 
    {
        alert('Passwort Wiederholung passt nicht');
    }
});

//======================================================================
// API

function ApiBenutzerSet(successCallback, errorCallback, benutzer) 
{
    fetch(apiBaseUrl + 'benutzer' + (benutzer.userid ? '/' + benutzer.userid : ''), 
    {
        method: benutzer.userid ? 'PUT' : 'POST',
        cache: 'no-cache',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(benutzer)
    })
    .then((response) => 
    {
        if (response.status == 200) 
        {
            return successCallback('Daten wurden erfolgreich geschickt!');
        }
        else if (response.status == 204) 
        {
            errorCallback('Daten sind unvollständig!');
        }
        else
        {
            throw new Error(response.status + ' ' + response.statusText);
        } 
    })
    .catch(errorCallback);
}