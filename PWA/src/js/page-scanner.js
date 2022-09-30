import "./app.js";
import Helper from "./helper.js";

export default class PageScanner
{
	constructor(args) 
	{
		this.app = args.app;
		args.app.LoadHTML('./page-scanner.html', args.app.Main, () => 
		{
            // Initialisierung
            const buttonGenerateQRCode = document.querySelector('#buttonGenerateQRCode');
            const divQrCodeTarget = document.querySelector('#divQrCodeTarget');
            const buttonStopScanning = document.querySelector('#buttonStopScanning');

            // Create instance of the object. The only argument is the "id" of HTML element created above.
            const html5QrCode = new Html5Qrcode("reader");

            // This method will trigger user permissions
            Html5Qrcode.getCameras().then(devices => 
            {
                /**
                 * devices would be an array of objects of type:
                 * { id: "id", label: "label" }
                 */
                if (devices && devices.length) 
                {
                var cameraId = devices[0].id;
                // .. use this to start scanning.

                html5QrCode.start(
                    cameraId,     // retreived in the previous step.
                    {
                        fps: 10,    // sets the framerate to 10 frame per second
                        qrbox: 250  // sets only 250 X 250 region of viewfinder to
                                    // scannable, rest shaded.
                    },
                    qrCodeMessage => 
                    {
                        // do something when code is read. For example:
                        // stops the camera
                        html5QrCode.stop().then(ignore => 
                        {
                            // QR Code scanning is stopped.
                            //console.log("QR Code scanning stopped.");
                        }).catch(err => 
                        {
                            // Stop failed, handle it.
                            console.log("Unable to stop scanning.");
                        });

                        window.open(qrCodeMessage, '_self');
                    },
                    errorMessage => 
                    {
                        // parse error, ideally ignore it. For example:
                        console.log(`QR Code no longer in front of camera.`);
                    })
                    .catch(err => 
                    {
                        // Start failed, handle it. For example,
                        console.log(`Unable to start scanning, error: ${err}`);
                    });
                }
            }).catch(err => 
                {
                // handle err
            });

            // Event listeners
            buttonGenerateQRCode.addEventListener('click', () =>
			{
				// Initialisierung
				let qrcode = undefined;
				this.Helper = new Helper();

				// logic
                let url = 'http://localhost:5500/src/index.html#finishrent?bid=' + args.bewegung_id;
				this.Helper.QRCodeGenerator(qrcode, document.getElementById('divQrCodeTarget'), url);
			});

            buttonStopScanning.addEventListener('click', () =>
            {
                html5QrCode.stop().then(ignore => 
                {
                    // QR Code scanning is stopped.
                    console.log("QR Code scanning stopped.");
                }).catch(err => 
                {
                    // Stop failed, handle it.
                    console.log("Unable to stop scanning.");
                });
            });
		});
	}
}