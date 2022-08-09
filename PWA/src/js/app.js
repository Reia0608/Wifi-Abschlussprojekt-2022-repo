if('serviceWorker' in navigator) 
{
    navigator.serviceWorker
        .register('./js/sw.js')
        .then(function() 
        {
            console.log('SERVICE WORKER registerd!');
        });
}