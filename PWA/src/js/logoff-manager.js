const apiBaseUrl = 'http://localhost:59968/api/';

ApiBenutzerLogoff(() => 
{
    window.open('http://localhost:5500/src/login.html', '_self');
    console.log("abgemeldet!");
}, (ex) => 
{
    alert(ex);
});


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