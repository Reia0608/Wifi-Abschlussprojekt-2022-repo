import "./app.js";
import Helper from "./helper.js";

export default class PageDamageLog
{
	constructor(args) 
	{
		this.app = args.app;
		args.app.LoadHTML('./page-damage-log.html', args.app.Main, () => 
		{
			// Intilialisierung
			const damageListBody = document.querySelector('#damageListBody');
			const buttonSchadenAdd = document.querySelector('#buttonSchadenAdd');
			const dialogSchaden = new bootstrap.Modal(modalSchadenBody);
			const buttonModalSchadenSpeichern = args.app.Main.querySelector('#buttonModalSchadenSpeichern');

			this.bildObject = {};

			// Logic
			this.loadData();

			// Event listeners
			buttonSchadenAdd.addEventListener('click', async () =>
			{
				let videoPlayer = document.querySelector('#videoPlayer');
				let buttonCapturePhoto = document.querySelector('#buttonCapturePhoto');
				let canvas = document.querySelector('#canvas');
				let divImagePicker = document.querySelector('#divImagePicker');

				//initialize media
				if (!('mediaDevices' in navigator)) 
				{
					navigator.mediaDevices = {};
				}

				if (!('getUserMedia' in navigator.mediaDevices)) 
				{
					//take advantage of older methods for special browsers
					navigator.mediaDevices.getUserMedia = function(constraints) 
					{
						var getUserMedia = navigator.webkitGetUserMedia() || navigator.mozGetUserMedia;
						if (!getUserMedia) 
						{
							return Promise.reject(new Error('getUserMedia is not implemented!'));
						}

						return new Promise((resolve, reject) =>
						{
							getUserMedia.call(navigator, constraints, resolve, reject);
						});
					} 
				}

				labelAnfallendeKosten.value = '';
				selectSchadenArt.value = '0';
				labelBeschreibung.value = '';
								
				this.schaden = 
				{
					schaden_id: null,
					schaden_datum: new Date()
				};
				labelAnfallendeKosten.classList.remove('is-invalid', 'is-valid');
				selectSchadenArt.classList.remove('is-invalid', 'is-valid');

				try
				{
					let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
					videoPlayer.srcObject = stream;
				}
				catch
				{
					divImagePicker.style.display = 'block';
				}

				buttonCapturePhoto.addEventListener('click', () =>
				{
					let image_data_url;
					canvas.getContext('2d').drawImage(videoPlayer, 0, 0, canvas.width, videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width));
					videoPlayer.style.display = 'none';
					canvas.style.display = 'block';
					image_data_url = canvas.toDataURL('image/jpeg');

					// Create the object of the photo for sending
					let base64String = image_data_url.replace("data:", "").replace(/^.+,/, "");
					this.bildObject.bild_bytes = base64String;
					this.bildObject.kraftfahrzeug_id = parseInt(localStorage.getItem("kid"));

					// Stops the cam from recording
					// videoPlayer.srcObject.getVideoTracks().forEach(function(track) 
					// {
					// 	track.stop();
					// });
				});

				dialogSchaden.show();
			});

			//---------------------------
			buttonModalSchadenSpeichern.addEventListener('click', (e) => 
			{
				let schadensArtText = "Unbekannt";
				let saveOk = true;
				labelAnfallendeKosten.classList.remove('is-invalid', 'is-valid');
				selectSchadenArt.classList.remove('is-invalid', 'is-valid');

				if (!labelAnfallendeKosten.value || (labelAnfallendeKosten.value && isNaN(labelAnfallendeKosten.value))) 
				{
					saveOk = false;
					labelAnfallendeKosten.classList.add('is-invalid');
				}
				else labelAnfallendeKosten.classList.add('is-valid');

				if (selectSchadenArt.value == '0') 
				{
					saveOk = false;
					selectSchadenArt.classList.add('is-invalid');
				}
				else selectSchadenArt.classList.add('is-valid');

				if (saveOk) 
				{
					if(document.cookie)
					{
						const benutzerMerkmal = document.cookie.split('; ').find(row => row.startsWith('benutzermerkmal=')).split('=')[1];

						this.app.ApiBenutzerGetId((response) =>
						{
							if (!this.schaden) 
							{
								this.schaden = 
								{
									schaden_id: null,
									schaden_datum: new Date()
								};
							}
							schadensArtText = selectSchadenArt.options[selectSchadenArt.selectedIndex].text;
							this.schaden.kraftfahrzeug_id = parseInt(localStorage.getItem("kid"));
							this.schaden.anfallendekosten = (labelAnfallendeKosten.value && !isNaN(labelAnfallendeKosten.value) ? parseInt(labelAnfallendeKosten.value) : 0);
							this.schaden.schadensart = schadensArtText;
							this.schaden.beschreibung = labelBeschreibung.value;
							this.schaden.users_id = response;

							if(divDateSchaden.value == "")
							{
								this.schaden.schaden_datum = null;
							}
							else
							{
								this.schaden.schaden_datum = divDateSchaden.value;
							}
							
							// Get the date of the "photo" to find schaden_id later on
							this.schaden.foto_datum = Date.now();

							if (!this.schadenList)
							{
								this.schadenList = [];
							} 
					
							this.schadenList[0] = this.schaden;
					
							// Update the database.
							this.app.ApiSchadenSet((response) => 
							{
								console.log("database was updated!");
								if (this.bildObject) 
								{
									// Get schaden_id for the picture
									this.app.ApiSchadenGetId((response) =>
									{
										this.bildObject.schaden_id = response;
										// update the database
										this.app.ApiBildSet(() => 
										{
											this.loadData();
										}, (ex) => 
										{
											alert(ex);
										}, this.bildObject);
									}, (ex) => 
									{
										alert(ex);
									}, this.schaden.foto_datum);
								}
								else
								{
									this.loadData();
								}
							}, (ex) => 
							{
								alert(ex);
							}, this.schaden);

							dialogSchaden.hide();
						}, (ex) =>
						{
							alert(ex);
						}, benutzerMerkmal);
					}
				}
			});
		});
	}

    // functions
	loadData()
	{
		// Initialisierung
		var kraftfahrzeug_id = localStorage.getItem("kid");
		const dateFormatter = new Intl.DateTimeFormat('de-AT', 
        {
            dateStyle: 'short'
        });

		// logic
		this.app.ApiSchadenGetKfzList((response) =>
		{
			let html = '';
			let iterator = 1;
			if(response == null)
			{
				damageListBody.innerHTML = `<p>Es gibt keine Schäden am Fahrzeug!</p>`;
			}
			else
			{
				damageListBody.innerHTML = '';
				for (let schaden of response) 
				{
					html = 
					`<div class="card cards mt-3" style="width: 18rem;">
						<img src="" class="card-img-top" alt="Ups! Hier ist etwas schief gelaufen!" data-schaden-id="${schaden.schaden_id}" id="imgBild_${iterator}">
						<div class="card-body" data-schaden-id="${schaden.schaden_id}">
							<h5 class="card-title">Schaden Nummer ${iterator}</h5>
							<p class="card-text">
								Schadensart: ${schaden.schadensart}<br>
								Beschreibung: ${schaden.beschreibung}<br>
								Anfallende Kosten: €${schaden.anfallendekosten},-<br>
								Datum des entstandenen Schadens: ${dateFormatter.format(new Date(schaden.schaden_datum))}<br>
							</p>
						</div>
					</div>
					`;
					iterator++;
					damageListBody.innerHTML += html;
				}
				this.app.ApiBilderGetAllSchadenListFromKfz((response) =>
                {
					if(response.length > 0)
					{
						// jiterator here, is the total amount of times we have assigned a picture to its HTML element
						let jiterator = 1;
						for (let schadenBild of response)
						{
							// iterator-1 here, is the total number of cards we put on screen in the previous API call
							for(let kiterator = 1; kiterator <= (iterator-1); kiterator++)
							{
								if(jiterator <= response.length)
								{
									var imgIdentifier = "imgBild_" + kiterator.toString();
									var imgBild = document.getElementById(imgIdentifier);
			
									if(schadenBild.schaden_id == imgBild.dataset.schadenId)
									{
										imgBild.src = "data:image/jpeg;base64," + schadenBild.bild_bytes;
										jiterator++;
									}	
								}
							}
						}
					}
                }, (ex) => 
                {
                    alert(ex);
                }, kraftfahrzeug_id);
			}
		}, (ex) =>
		{
			alert(ex);
		}, kraftfahrzeug_id);
	}
}